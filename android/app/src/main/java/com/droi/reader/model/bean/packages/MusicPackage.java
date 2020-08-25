package com.droi.reader.model.bean.packages;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.bean.MusicBean;

public class MusicPackage extends BaseBean {
    private MusicBean data;

    public MusicBean getData() {
        return data;
    }

    public void setData(MusicBean data) {
        this.data = data;
    }
}
