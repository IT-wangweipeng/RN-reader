package com.droi.reader.utils;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.view.View;

import java.io.ByteArrayOutputStream;

public class BitmapUtils {

    public static Bitmap getViewBitmap(View addViewContent) {
        addViewContent.setDrawingCacheEnabled(true);
        addViewContent.measure(
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
        addViewContent.layout(0, 0,
                addViewContent.getMeasuredWidth(),
                addViewContent.getMeasuredHeight());
        addViewContent.buildDrawingCache();
        Bitmap cacheBitmap = addViewContent.getDrawingCache();
        if(cacheBitmap == null){
            return null;
        }
        Bitmap bitmap = Bitmap.createBitmap(cacheBitmap);
        return bitmap;
    }

    public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, output);
        if (needRecycle) {
            bmp.recycle();
        }

        byte[] result = output.toByteArray();
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 创建指定大小的bitmap的byte流，大小 <= maxSize
     *
     * @param srcBitmap bitmap
     * @param maxSize   kb,example 32kb
     * @return byte流
     */
    public static synchronized byte[] getStaticSizeBitmapByteByBitmap(Bitmap srcBitmap, int maxSize) {
        Bitmap.CompressFormat format = Bitmap.CompressFormat.PNG;
        // 首先进行一次大范围的压缩
        Bitmap tempBitmap;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        // 设置矩阵数据
        Matrix matrix = new Matrix();
        srcBitmap.compress(format, 100, output);
        // 如果进行了上面的压缩后，依旧大于32K，就进行小范围的微调压缩
        byte[] bytes = output.toByteArray();
        LogUtils.i("yy", "开始循环压缩之前 bytes = " + bytes.length);
        while (bytes.length > maxSize) {
            matrix.setScale(0.9f, 0.9f);//每次缩小 1/10
            tempBitmap = srcBitmap;
            srcBitmap = Bitmap.createBitmap(
                    tempBitmap, 0, 0,
                    tempBitmap.getWidth(), tempBitmap.getHeight(), matrix, true);
            //recyclerBitmaps(tempBitmap);
            output.reset();
            srcBitmap.compress(format, 100, output);
            bytes = output.toByteArray();
            LogUtils.i("yy", "压缩一次 bytes = " + bytes.length);
        }
        LogUtils.i("yy", "压缩后的图片输出大小 bytes = " + bytes.length);
        //recyclerBitmaps(srcBitmap);
        return bytes;
    }

    public static void recyclerBitmaps(Bitmap... bitmaps) {
        try {
            for (Bitmap bitmap : bitmaps) {
                if (bitmap != null && !bitmap.isRecycled()) {
                    bitmap.recycle();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
