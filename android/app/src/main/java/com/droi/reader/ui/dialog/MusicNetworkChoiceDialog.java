package com.droi.reader.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import com.droi.reader.R;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.ScreenUtils;

import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class MusicNetworkChoiceDialog extends Dialog {
    private Unbinder unbinder;
    private OnClickListener mOnClickListener;

    public interface OnClickListener {
        void onOkClick();

        void onCancelClick();
    }

    public void setOnClickListener(OnClickListener onClickListener) {
        mOnClickListener = onClickListener;
    }

    public MusicNetworkChoiceDialog(Context context) {
        super(context);
    }

    @OnClick({R.id.cancel, R.id.ok})
    public void onClick(View view) {
        LogUtils.i("gg","onClick id="+view.getId());
        switch (view.getId()) {
            case R.id.cancel:
                LogUtils.i("gg","onClick cancel mOnClickListener="+mOnClickListener);
                if (mOnClickListener != null) {
                    mOnClickListener.onCancelClick();
                }
                break;
            case R.id.ok:
                LogUtils.i("gg","onClick ok mOnClickListener="+mOnClickListener);
                if (mOnClickListener != null) {
                    mOnClickListener.onOkClick();
                }
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (ReadSettingManager.getInstance().isNightMode()) {
            setContentView(R.layout.dialog_music_network_choice_night);
        } else {
            setContentView(R.layout.dialog_music_network_choice);
        }
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
