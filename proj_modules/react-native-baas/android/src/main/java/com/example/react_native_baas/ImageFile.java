package com.example.react_native_baas;

import com.droi.sdk.core.DroiExpose;
import com.droi.sdk.core.DroiFile;
import com.droi.sdk.core.DroiObject;

/**
 * Created by kevin on 2017/9/2.
 */

public class ImageFile extends DroiObject {
    @DroiExpose
    public int width;
    @DroiExpose
    public int height;
    @DroiExpose
    public String imageID;
    @DroiExpose
    public DroiFile file;
}
