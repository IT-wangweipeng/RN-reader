package com.droi.reader.ui.activity;

import android.app.Dialog;
import android.content.Context;

import com.droi.reader.R;

public class PrivacyDialog extends Dialog {
    public PrivacyDialog(Context context) {
        super(context, R.style.PrivacyThemeDialog);

        setContentView(R.layout.dialog_privacy);

        setCancelable(false);
        setCanceledOnTouchOutside(false);
    }
}
