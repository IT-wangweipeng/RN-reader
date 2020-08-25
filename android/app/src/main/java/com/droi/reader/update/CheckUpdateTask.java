package com.droi.reader.update;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.droi.reader.R;
import com.droi.reader.ui.dialog.CheckUpdateDialog;
import com.droi.reader.utils.FileUtils;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.SharedPreUtils;

import org.json.JSONException;
import org.json.JSONObject;


public class CheckUpdateTask extends AsyncTask<Void, Void, String> {
    public static final String APK_DOWNLOAD_URL = "url";
    public static final String APK_UPDATE_CONTENT = "updateMessage";
    public static final String APK_VERSION_CODE = "versionCode";
    public static final String APK_FORCE_UPDATE = "force_update";

    private Context mContext;
    private String url;
    private int type;//1:启动app时检查更新，若返回类型为强更，则显示，且点击取消是退出app 0:点击我的页面版本检查，若返回类型为非强更，则显示，且点击取消是退出dialog

    public CheckUpdateTask(Context context, int type) {
        this.mContext = context;
        this.url = SharedPreUtils.getInstance().getApiAddress() + "forcedupdate";
        this.type = type;
    }

    @Override
    protected String doInBackground(Void... args) {
        LogUtils.i("yy", "CheckUpdateTask doInBackground url=" + url);
        return HttpUtils.get(url);
    }

    @Override
    protected void onPostExecute(String result) {
        if (!TextUtils.isEmpty(result)) {
            parseJson(result);
        }
    }

    private void parseJson(String result) {
        try {

            JSONObject rootObj = new JSONObject(result);
            int statusCode = rootObj.getInt("status");
            String message = rootObj.getString("message");
            String data = rootObj.getString("data");
            LogUtils.i("yy", "parseJson statusCode=" + statusCode + ",message=" + message + ",data=" + data);
            JSONObject obj = new JSONObject(data);
            if (TextUtils.isEmpty(data)) {
                return;
            }
            String updateMessage = obj.getString(APK_UPDATE_CONTENT);
            String apkUrl = obj.getString(APK_DOWNLOAD_URL);
            int apkCode = obj.getInt(APK_VERSION_CODE);
            int force_update = obj.getInt(APK_FORCE_UPDATE);//1是强更，0不强更

            int versionCode = AppUtils.getVersionCode(mContext);
            LogUtils.i("yy", "parseJson() apkCode=" + apkCode + ",oldCode=" + versionCode + ",force_update=" + force_update + ",apkUrl=" + apkUrl + ",updateMessage=" + updateMessage);
            if(type == 1 && force_update == 1) {
                if (apkCode > versionCode) {
                    //delete last apk
                    FileUtils.deleteFile(StorageUtils.getDownloadParentFile().getPath());
                    showDialog(mContext, updateMessage, apkUrl, type);
                }
            } else if(type == 0) {
                if (apkCode > versionCode && force_update == 0) {
                    //delete last apk
                    FileUtils.deleteFile(StorageUtils.getDownloadParentFile().getPath());
                    showDialog(mContext, updateMessage, apkUrl, type);
                } else {
                    Toast.makeText(mContext, mContext.getString(R.string.current_is_lastest_version), Toast.LENGTH_SHORT).show();
                }
            }


        } catch (JSONException e) {
            LogUtils.i("yy", "parse json error");
        }
    }


    /**
     * Show dialog
     */
    private void showDialog(Context context, String content, String apkUrl, int type) {
        if (isContextValid(context)) {
            CheckUpdateDialog checkUpdateDialog = new CheckUpdateDialog(context, content);
            checkUpdateDialog.setOnClickListener(new CheckUpdateDialog.OnClickListener() {
                @Override
                public void onOkClick() {
                    checkUpdateDialog.dismiss();
                    if (NetworkUtils.isAvailable(context)) {
                        new DownloadTask(context).execute(apkUrl);
                    }
                }

                @Override
                public void onCancelClick() {
                    checkUpdateDialog.dismiss();
                    if(type == 1) {
                     ((Activity) context).finish();
                    }
                }
            });
            checkUpdateDialog.setCancelable(false);
            checkUpdateDialog.show();
        }
    }

    private boolean isContextValid(Context context) {
        return context instanceof Activity && !((Activity) context).isFinishing();
    }
}
