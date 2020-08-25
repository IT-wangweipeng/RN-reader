package com.droi.reader.utils;

import android.util.Log;

public class LogUtils {
    public static final boolean showLog = false;

    public static void i(String tag,String msg){
        if(showLog){
            Log.i(tag,msg);
        }
    }
    public static void v(String tag,String msg){
        if(showLog){
            Log.v(tag,msg);
        }
    }
    public static void w(String tag,String msg){
        if(showLog){
            Log.w(tag,msg);
        }
    }
    public static void d(String tag,String msg){
        if(showLog){
            Log.d(tag,msg);
        }
    }
    public static void e(String tag,String msg){
        if(showLog){
            Log.e(tag,msg);
        }
    }
}
