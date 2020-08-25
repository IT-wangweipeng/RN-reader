package com.droi.reader.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.droi.reader.R;
import com.droi.reader.utils.ScreenUtils;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

public class RuleDialog extends Dialog {
    private Unbinder unbinder;

    @BindView(R.id.ok)
    TextView mOK;

    @OnClick(R.id.ok)
    public void onClick(View view){
        switch(view.getId()) {
            case R.id.ok:
                dismiss();
                break;
        }
    }

    public RuleDialog( Context context) {
        super(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_rule);
        unbinder = ButterKnife.bind(this);
        setUpWindow();
    }

    private void setUpWindow(){
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.width = ScreenUtils.dpToPx(280);//WindowManager.LayoutParams.WRAP_CONTENT;
        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        lp.horizontalMargin = 0;
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        unbinder.unbind();
    }
}
