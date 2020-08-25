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


public class HotbeanGetDialog extends Dialog {
    private Unbinder unbinder;
    private int taskType;
    public HotbeanGetDialog(Context context, int taskType) {
        super(context);
        this.taskType = taskType;
    }

    private TextView mText;

    @OnClick({R.id.ok})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.ok:
                dismiss();
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_hotbean_get);
        mText = findViewById(R.id.text);
        String text = "";
        switch(taskType){
            case 5:
                text = "恭喜您,阅读30分钟获得100热豆奖励,继续阅读30分钟,将会获得200热豆奖励,继续加油哦!";
                break;
            case 6:
                text = "恭喜您,阅读60分钟获得200热豆奖励,继续阅读60分钟,将会获得500热豆奖励,继续加油哦!";
                break;
            case 7:
                text = "恭喜您,阅读120分钟获得500热豆奖励,继续阅读60分钟,将会获得1000热豆奖励,继续加油哦!";
                break;
            case 18:
                text = "恭喜您,阅读180分钟获得1000热豆奖励!";
                break;
        }
        mText.setText(text);

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
