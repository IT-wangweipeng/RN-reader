package com.droi.reader.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import com.droi.reader.R;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.ScreenUtils;

import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class HotbeanTipDialog extends Dialog {
    private Unbinder unbinder;
    public HotbeanTipDialog(Context context) {
        super(context);
    }
    @OnClick({R.id.ok})
    public void onClick(View view) {
        LogUtils.i("gg","onClick id="+view.getId());
        switch (view.getId()) {
            case R.id.ok:
                dismiss();
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_hotbean_tip);
        unbinder = ButterKnife.bind(this);
        setUpWindow();
    }


    private void setUpWindow() {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.width = ScreenUtils.dpToPx(250);//WindowManager.LayoutParams.WRAP_CONTENT;
        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        lp.horizontalMargin = 0;

        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        unbinder.unbind();
    }

}
