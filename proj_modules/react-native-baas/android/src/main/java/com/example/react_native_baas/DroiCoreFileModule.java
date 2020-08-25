package com.example.react_native_baas;

import android.net.Uri;
import android.util.Log;

import com.droi.sdk.DroiCallback;
import com.droi.sdk.DroiError;
import com.droi.sdk.core.DroiCondition;
import com.droi.sdk.core.DroiFile;
import com.droi.sdk.core.DroiObject;
import com.droi.sdk.core.DroiQuery;
import com.droi.sdk.core.DroiQueryCallback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;

import java.io.File;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.List;

/**
 * Created by kevin on 2017/9/2.
 */

public class DroiCoreFileModule extends ReactContextBaseJavaModule {
    private static final String TAG = DroiCoreFileModule.class.getSimpleName();

    public DroiCoreFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
        DroiObject.registerCustomClass(ImageFile.class);
    }

    @Override
    public String getName() {
        return "DroiFile";
    }

    @ReactMethod
    public void save(
            String filePath,
            final Promise promise) {

        System.out.println("Saving File " + filePath);
        DroiFile image = new DroiFile(new File(filePath));
        ImageFile imageFile = new ImageFile();
        imageFile.file = image;

        final String id = image.getObjectId();
        imageFile.imageID = id;

        imageFile.saveInBackground(new DroiCallback<Boolean>() {
            @Override
            public void result(Boolean isSuccess, DroiError droiError) {
                System.out.println("Save result: " + isSuccess + droiError.toString());
                if (isSuccess) {
                    DroiQuery query = DroiQuery.Builder.newBuilder()
                            .cloudStorage()
                            .query(ImageFile.class)
                            .where(DroiCondition.eq("imageID", id))
                            .build();
                    query.runQueryInBackground(new DroiQueryCallback<ImageFile>() {
                        @Override
                        public void result(List<ImageFile> list, DroiError droiError) {
                            if (droiError.isOk() && list.size() > 0) {
                                ImageFile imageFile = list.get(0);
                                if (imageFile.file != null) {
                                    imageFile.file.getUriInBackground(new DroiCallback<Uri>() {
                                        @Override
                                        public void result(Uri uri, DroiError droiError) {
                                            System.out.println("get result: " + uri + droiError.toString());
                                            if (droiError.isOk()) {
                                                WritableMap map = Arguments.createMap();
                                                map.putBoolean("result", droiError.isOk());
                                                map.putString("id", id);
                                                map.putString("uri", String.valueOf(uri));
                                                promise.resolve(map);
                                            } else {
                                                promise.reject("", droiError.toString());
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                } else {
                    promise.reject("" + droiError.getCode(), droiError.toString());
                }

            }
        });
    }


    @ReactMethod
    public void multiSave(
            final ReadableArray filePaths,
            final Promise promise) {


        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                WritableMap resultMap = Arguments.createMap();
                WritableArray resultArray = Arguments.createArray();
                WritableArray successArray = Arguments.createArray();
//                WritableArray failedArray = Arguments.createArray();
                String code = "";
                String msg = "";
                boolean shouldLoop = true;
                for (int i = 0; i < filePaths.size(); i++) {
                    if (!shouldLoop) {
                        break;
                    }
                    switch (filePaths.getType(i)) {
                        case String: {
                            String filePath = filePaths.getString(i);
                            DroiFile image = new DroiFile(new File(filePath));
                            ImageFile imageFile = new ImageFile();
                            imageFile.file = image;
                            String id = image.getObjectId();
                            imageFile.imageID = id;

                            DroiError droiError = imageFile.save();
                            if (droiError.isOk()) {
                                Log.v(TAG, "Save Success: " + filePath);
                                DroiQuery query = DroiQuery.Builder.newBuilder()
                                                            .cloudStorage()
                                                            .query(ImageFile.class)
                                                            .where(DroiCondition.eq("imageID", id))
                                                            .build();
                                DroiError queryError = new DroiError();
                                List<ImageFile> list = query.runQuery(queryError);
                                if (list.size() > 0 ) {
                                    ImageFile imgFile = list.get(0);
                                    if(imgFile.file != null) {
                                        shouldLoop = true;
                                        DroiError uriError = new DroiError();
                                        Uri uri = imageFile.file.getUri(new AtomicBoolean(false),uriError);
                                        WritableMap successMap = Arguments.createMap();
                                        successMap.putString("id", id);
                                        successMap.putString("uri", String.valueOf(uri));
                                        successArray.pushMap(successMap);
                                    } else {
                                        shouldLoop = false;
                                        code = "" + queryError.getCode();
                                        msg = queryError.toString();
                                    }
                                }
                            } else {
                                code = "" + droiError.getCode();
                                msg = droiError.toString();
                                shouldLoop = false;
                            }

                            break;
                        }
                        default:
                            break;
                    }
                }
                if (shouldLoop) {
                    resultMap.putBoolean("result", shouldLoop);
                    resultMap.putArray("images", successArray);
                    resultArray.pushMap(resultMap);
                    promise.resolve(resultArray);
                } else {
                    promise.reject(code, msg);
                }
            }
        });

        thread.start();


    }
}
