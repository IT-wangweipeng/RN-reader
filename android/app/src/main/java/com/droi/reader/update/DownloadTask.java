package com.droi.reader.update;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.os.PowerManager;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.remote.RemoteRepository;
import com.droi.reader.utils.LogUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import io.reactivex.SingleObserver;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class DownloadTask extends AsyncTask<String, Integer, Integer> {
    private static final int BUFFER_SIZE = 10 * 1024; // 8k ~ 32K
    private static final int RESULT_DOWNLOAD_SUCCESS = 1;
    private static final int RESULT_DOWNLOAD_FAIL = 2;

    private Context context;
    private PowerManager.WakeLock mWakeLock;
    private ProgressDialog mProgressDialog;
    private File mApkFile;

    public DownloadTask(Context context) {
        this.context = context;
    }

    private void uploadAppDownloadCount(String apkUrl) {
        JSONObject root = new JSONObject();
        try {
            root.put("url", apkUrl);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        LogUtils.i("yy", "appDownload root=" + root);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
        RemoteRepository.getInstance().appDownload(requestBody)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new SingleObserver<BaseBean>() {
                    Disposable disposable;

                    @Override
                    public void onSubscribe(Disposable d) {
                        disposable = d;
                    }

                    @Override
                    public void onSuccess(BaseBean value) {
                        LogUtils.i("yy", "appDownload onSuccess status=" + value.status + ",message=" + value.message);
                        disposable.dispose();
                    }

                    @Override
                    public void onError(Throwable e) {
                        LogUtils.i("yy", "appDownload onError e=" + e.toString());
                        disposable.dispose();
                    }
                });
    }

    @Override
    protected Integer doInBackground(String... sUrl) {
        uploadAppDownloadCount(sUrl[0]);

        String urlStr = sUrl[0];
        InputStream in = null;
        FileOutputStream out = null;
        try {
            URL url = new URL(urlStr);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

            urlConnection.setRequestMethod("GET");
            urlConnection.setDoOutput(false);
            urlConnection.setConnectTimeout(10 * 1000);
            urlConnection.setReadTimeout(10 * 1000);
            urlConnection.setRequestProperty("Connection", "Keep-Alive");
            urlConnection.setRequestProperty("Charset", "UTF-8");
            urlConnection.setRequestProperty("Accept-Encoding", "gzip, deflate");

            urlConnection.connect();
            long bytetotal = urlConnection.getContentLength();
            long bytesum = 0;
            int byteread = 0;
            in = urlConnection.getInputStream();
            File dir = StorageUtils.getDownloadParentFile();
            String apkName = urlStr.substring(urlStr.lastIndexOf("/") + 1, urlStr.length());
            mApkFile = new File(dir, apkName);
            out = new FileOutputStream(mApkFile);
            byte[] buffer = new byte[BUFFER_SIZE];

            int oldProgress = 0;

            while ((byteread = in.read(buffer)) != -1) {
                bytesum += byteread;
                out.write(buffer, 0, byteread);

                int progress = (int) (bytesum * 100L / bytetotal);
                // 如果进度与之前进度相等，则不更新，如果更新太频繁，否则会造成界面卡顿
                if (progress != oldProgress) {
                    publishProgress(progress);
                }
                oldProgress = progress;
            }
        } catch (Exception e) {
            LogUtils.i("yy", "download apk file error:" + e.getMessage());
            return RESULT_DOWNLOAD_FAIL;
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException ignored) {

                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException ignored) {

                }
            }
        }
        return RESULT_DOWNLOAD_SUCCESS;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        // take CPU lock to prevent CPU from going off if the user
        // presses the power button during download
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                getClass().getName());
        mWakeLock.acquire();

        mProgressDialog = new ProgressDialog(context);
        mProgressDialog.setMessage("正在下载");
        mProgressDialog.setIndeterminate(false);
        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        mProgressDialog.setCancelable(false);
        mProgressDialog.setCanceledOnTouchOutside(false);
        mProgressDialog.setMax(100);
        mProgressDialog.show();
    }

    @Override
    protected void onProgressUpdate(Integer... progress) {
        super.onProgressUpdate(progress);
        // if we get here, length is known, now set indeterminate to false
        mProgressDialog.setProgress(progress[0]);
    }

    @Override
    protected void onPostExecute(Integer result) {
        LogUtils.i("yy", "DownloadTask onPostExecute() result=" + result);
        mWakeLock.release();
        mProgressDialog.dismiss();
        if (result == RESULT_DOWNLOAD_SUCCESS && mApkFile != null && mApkFile.exists()) {
            ApkUtils.installAPk(context, mApkFile);
        }
    }
}
