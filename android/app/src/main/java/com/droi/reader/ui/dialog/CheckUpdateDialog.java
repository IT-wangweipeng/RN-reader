package com.droi.reader.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.droi.reader.R;
import com.droi.reader.utils.ScreenUtils;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class CheckUpdateDialog extends Dialog {
    private Unbinder unbinder;
    private OnClickListener mOnClickListener;
    private String message;


    public interface OnClickListener {
        void onOkClick();

        void onCancelClick();
    }

    public void setOnClickListener(OnClickListener onClickListener) {
        mOnClickListener = onClickListener;
    }

    public CheckUpdateDialog(Context context, String message) {
        super(context);
        this.message = message;
    }

    @BindView(R.id.content)
    TextView mContent;


    @OnClick({R.id.cancel, R.id.ok})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.cancel:
                if (mOnClickListener != null) {
                    mOnClickListener.onCancelClick();
                }
                break;
            case R.id.ok:
                if (mOnClickListener != null) {
                    mOnClickListener.onOkClick();
                }
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_check_update);
        unbinder = ButterKnife.bind(this);
        mContent.setText(message);
        setUpWindow();
    }


    private void setUpWindow() {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        int width = ScreenUtils.getDisplayMetrics().widthPixels - ScreenUtils.dpToPx(30) * 2;
        lp.width = width;//ScreenUtils.dpToPx(250);//WindowManager.LayoutParams.WRAP_CONTENT;
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
