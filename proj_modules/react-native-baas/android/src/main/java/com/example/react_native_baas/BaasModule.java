package com.example.react_native_baas;

import android.util.Log;

import com.droi.sdk.DroiCallback;
import com.droi.sdk.DroiError;
import com.droi.sdk.core.DroiCondition;
import com.droi.sdk.core.DroiObject;
import com.droi.sdk.core.DroiPreference;
import com.droi.sdk.core.DroiQuery;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

/**
 * Created by wangxinqi on 2018/1/8.
 */

public class BaasModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private String packageName = null;

    public BaasModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        packageName = reactContext.getPackageName();
    }

    @Override
    public String getName() {
        return "BaasModule";
    }

    @ReactMethod
    public void searchClassName(String tableName, ReadableArray whereClause, ReadableMap options, Promise promise) {
        Log.i("tableName :", tableName);
        Log.i("whereClause :", whereClause.toString());
        Log.i("options :", options.toString());
        DroiCondition cond = null;
        DroiQuery.Builder builder = DroiQuery.Builder.newBuilder().query(tableName);
        builder = builderOption(builder, options);
        if (whereClause.size() > 0) {
            cond = parseCondition(whereClause);
        }
        if (cond != null) {
            builder = builder.where(cond);
        }
        DroiQuery query = builder.build();
        DroiError droiError = new DroiError();
        List<DroiObject> list = query.runQuery(droiError);
        DroiResult result = new DroiResult();
        result.Code = droiError.getCode();
        result.ArrayResult = Utils.listToJSONArray(list);
        result.Count = list.size();

        if (droiError.isOk()) {
            Log.i("success:", String.valueOf(result.ArrayResult));
            promise.resolve(String.valueOf(result.ArrayResult));
        } else {
            Log.e("failed:", droiError.toString());
            promise.reject(String.valueOf(result.Code), droiError.toString());
        }
    }

    /**
     * 查询条件
     *
     * @param whereClause
     * @return
     */
    private DroiCondition parseCondition(ReadableArray whereClause) {
        DroiCondition cond = null;
        for (int i = 0; i < whereClause.size(); i++) {
            ReadableArray list = whereClause.getArray(i);
            DroiCondition condI = null;
            for (int j = 0; j < list.size(); j++) {
                ReadableMap readableMap = list.getMap(j);
                try {
                    JSONObject jsonObject = Utils.convertMapToJson(readableMap);
                    String key = jsonObject.getString("key");
                    String type = jsonObject.getString("type");
                    Object value = jsonObject.get("value");
                    DroiCondition condJ = DroiCondition.cond(key, type, value);
                    if (j == 0) {
                        condI = condJ;
                    } else {
                        String conditionLink = jsonObject.getString("conditionLink");
                        if (conditionLink.equals("||")) {
                            condI = condI.or(condJ);
                        } else {
                            condI = condI.and(condJ);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            if (i == 0) {
                cond = condI;
            } else {
                String conditionLink = list.getMap(0).getString("conditionLink");
                if (conditionLink.equals("||")) {
                    cond = cond.or(condI);
                } else {
                    cond = cond.and(condI);
                }
            }
        }

        return cond;
    }

    /**
     * 设置查询bulder
     *
     * @param builder
     * @param options
     * @return
     */
    private DroiQuery.Builder builderOption(DroiQuery.Builder builder, ReadableMap options) {
        if (options == null) {
            return builder;
        }
        // offset 回传数据的起始位置
        int offset = options.getInt("offset");
        builder = builder.offset(offset);
        // limit 回传数量（最大每次1000条）
        int limit = options.getInt("limit");
        builder = builder.limit(limit);
        // order
        String orderString = options.getString("orderBy");
        String[] orders = orderString.split(",");
        for (String orderName : orders) {
            if (orderName.startsWith("-")) {
                builder = builder.orderBy(orderName.substring(1), false);
            } else {
                builder = builder.orderBy(orderName.substring(1), true);
            }
        }
        return builder;
    }

    @ReactMethod
    public void cloudParam(final String key, final Promise promise) {
        // 异步方法
        DroiPreference.instance().refreshInBackground(new DroiCallback<Boolean>() {
            @Override
            public void result(Boolean result, DroiError error) {
                if (result) {
                    // 可以通过这种方式，在获得云端数据后，取得云参数
                    String strValue = DroiPreference.instance().getString(key);
                    promise.resolve(strValue);
                } else {
                    promise.reject(String.valueOf(error.getCode()), error.getAppendedMessage());
                }
            }
        });
    }

    @ReactMethod
    public void cloudParamForward(final String key, final Promise promise) {
        if (DroiPreference.instance().isReady()) {
            String strValue = DroiPreference.instance().getString(key);
            promise.resolve(strValue);
        } else {
            promise.reject("10086", "Preference is not isReady");
        }
    }


    @ReactMethod
    public void getDroiApiID(final Promise promise) {
        PackageManager pm = this.reactContext.getPackageManager();
        String value = null;
        try {
            ApplicationInfo pInfo = pm.getApplicationInfo(this.packageName, PackageManager.GET_META_DATA);
            value = pInfo.metaData.getString("com.droi.sdk.application_id");
            promise.resolve(value);
        } catch (PackageManager.NameNotFoundException e) {
            //e.printStackTrace();
            Log.e("react-native-application", "droi app id not found");
            promise.resolve(e);
        }

    }


    @ReactMethod
    public void getMetaData(final String key, final Promise promise) {
        //这里只能获取application瞎的metaData
        PackageManager pm = this.reactContext.getPackageManager();
        String value = null;
        try {
            ApplicationInfo pInfo = pm.getApplicationInfo(this.packageName, PackageManager.GET_META_DATA);
            value = pInfo.metaData.getString(key);
            promise.resolve(value);
        } catch (PackageManager.NameNotFoundException e) {
            //e.printStackTrace();
            Log.e("react-native-application", "meta data name not found");
            promise.resolve(e);
        }

    }

}
