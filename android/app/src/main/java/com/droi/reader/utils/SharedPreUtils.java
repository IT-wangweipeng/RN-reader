package com.droi.reader.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.droi.reader.MainApplication;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class SharedPreUtils {
    private static final String SHARED_NAME = "reader_pref";
    private static SharedPreUtils sInstance;
    private SharedPreferences sharedReadable;
    private SharedPreferences.Editor sharedWritable;

    private SharedPreUtils(){
        sharedReadable = MainApplication.getContext()
                .getSharedPreferences(SHARED_NAME, Context.MODE_MULTI_PROCESS);
        sharedWritable = sharedReadable.edit();
    }

    public static SharedPreUtils getInstance(){
        if(sInstance == null){
            synchronized (SharedPreUtils.class){
                if (sInstance == null){
                    sInstance = new SharedPreUtils();
                }
            }
        }
        return sInstance;
    }

    public String getString(String key){
        return sharedReadable.getString(key,"");
    }

    public void putString(String key, String value){
        sharedWritable.putString(key,value);
        sharedWritable.commit();
    }

    public void putInt(String key, int value){
        sharedWritable.putInt(key, value);
        sharedWritable.commit();
    }

    public void putLong(String key, long value) {
        sharedWritable.putLong(key, value);
        sharedWritable.commit();
    }

    public void putBoolean(String key, boolean value){
        sharedWritable.putBoolean(key, value);
        sharedWritable.commit();
    }

    public int getInt(String key, int def){
        return sharedReadable.getInt(key, def);
    }

    public long getLong(String key, long def) {
        return sharedReadable.getLong(key, def);
    }
    public boolean getBoolean(String key, boolean def){
        return sharedReadable.getBoolean(key, def);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    public boolean getAdStatus() {
        return sharedReadable.getBoolean(Constant.KEY_AD_FEATURE, true);
    }

    public void setAdStatus(boolean status) {
        sharedWritable.putBoolean(Constant.KEY_AD_FEATURE, status);
        sharedWritable.commit();
    }

    public int getAdType() {
        return sharedReadable.getInt(Constant.KEY_AD_TYPE, Constant.DEFAULT_AD_TYPE);
    }

    public void setAdType(int adType) {
        sharedWritable.putInt(Constant.KEY_AD_TYPE, adType);
        sharedWritable.commit();
    }

    public String getApiAddress() {
        return sharedReadable.getString(Constant.KEY_API_ADDRESS, Constant.PRODUCTION_API_BASE_URL);
    }

    public String getWechatShareWebpageUrl(){
        return sharedReadable.getString(Constant.KEY_WECHAT_SHARE_WEBPAGE_URL, Constant.PRODUCTION_WECHAT_WEBPAGE_URL);
    }

    public void setApiAddress(String apiAddress) {
        sharedWritable.putString(Constant.KEY_API_ADDRESS, apiAddress);
        sharedWritable.commit();
    }

    public void setWechatShareWebpageUrl(String webpageUrl){
        sharedWritable.putString(Constant.KEY_WECHAT_SHARE_WEBPAGE_URL, webpageUrl);
        sharedWritable.commit();
    }

    public boolean getMusicPlayFeature() {
        return sharedReadable.getBoolean(Constant.KEY_MUSIC_PLAY_FEATURE, false);
    }

    public void setMusicPlayFeature(boolean status) {
        sharedWritable.putBoolean(Constant.KEY_MUSIC_PLAY_FEATURE, status);
        sharedWritable.commit();
    }

    public boolean getPrivacyStatus(){
        return sharedReadable.getBoolean(Constant.KEY_PRIVACY, false);
    }
    public void setPrivacyStatus(boolean status){
        sharedWritable.putBoolean(Constant.KEY_PRIVACY, status);
        sharedWritable.commit();
    }

    public int[] getAdSourcePool(){
        String str = sharedReadable.getString(Constant.KEY_AD_SOURCE_POOL,"[8,10]");
//        LogUtils.i("yy","getAdSourcePool pool="+str);
        if(str.equals("[]")){
            return new int[1];
        }
        str = str.substring(1, str.length()-1);
//        LogUtils.i("yy","after str="+str);
        String[] str_array = str.split(",");
        int[] int_array = new int[str_array.length];
        for(int i= 0; i< str_array.length;i++){
            int_array[i] = Integer.parseInt(str_array[i]);
        }
//        LogUtils.i("yy","int_array="+int_array.toString());
        return int_array;
    }

    public void saveAdsSource(String adsSource){
        LogUtils.i("yy","saveAdsSource adsSource="+adsSource);
        sharedWritable.putString(Constant.KEY_AD_SOURCE_POOL,adsSource);
        sharedWritable.commit();
    }




}
