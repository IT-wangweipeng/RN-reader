package com.droi.reader.ui.dialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.droi.reader.MainApplication;
import com.droi.reader.R;
import com.droi.reader.model.bean.SignBean;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.model.remote.RemoteRepository;
import com.droi.reader.utils.BitmapUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.ScreenUtils;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.tauth.Tencent;

import org.json.JSONException;
import org.json.JSONObject;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.SingleObserver;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class ShareDialog extends Dialog {
    private Unbinder unbinder;
    private Context mContext;
    private IWXAPI wxApi;
    private Tencent qqApi;

    private String title;
    private String description;
    private String thumbImage;
    private String webpageUrl;
    private String token;

    @BindView(R.id.share_to_wx_friend)
    LinearLayout mShareToFriend;
    @BindView(R.id.share_to_wx_friend_circle)
    LinearLayout mShareToFriendCircle;
    @BindView(R.id.share_to_qq_friend)
    LinearLayout mShareToQQFriend;
    @BindView(R.id.share_to_qq_zone)
    LinearLayout mShareToQQZone;

    @OnClick({R.id.share_to_wx_friend, R.id.share_to_wx_friend_circle, R.id.share_to_qq_friend, R.id.share_to_qq_zone})
    public void onClick(View view){
        switch(view.getId()) {
            case R.id.share_to_wx_friend:
                shareToFriend();
                break;
            case R.id.share_to_wx_friend_circle:
                shareToFriendCircle();
                break;
            case R.id.share_to_qq_friend:
                shareToQQFriend();
                break;
            case R.id.share_to_qq_zone:
                shareToQQZone();
                break;
        }
    }

    private void regToWX() {
        wxApi = WXAPIFactory.createWXAPI(mContext, Constant.WX_APP_ID, true);
        wxApi.registerApp(Constant.WX_APP_ID);
    }

    private void regToQQ() {
        qqApi = Tencent.createInstance(Constant.QQ_APP_ID, mContext);
    }

    public ShareDialog(Context context, String title, String description, String thumbImage, String webpageUrl, String token) {
        super(context);
        mContext = context;
        this.title = title;
        this.description = description;
        this.thumbImage = thumbImage;
        this.webpageUrl = webpageUrl;
        this.token = token;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (ReadSettingManager.getInstance().isNightMode()) {
            setContentView(R.layout.dialog_share_night);
        } else {
            setContentView(R.layout.dialog_share);
        }
        unbinder = ButterKnife.bind(this);
        setUpWindow();
        regToWX();
        regToQQ();
    }

    private void setUpWindow(){
        getWindow().setGravity(Gravity.BOTTOM);
        getWindow().getDecorView().setPadding(0, 0, 0, 0);

        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.width = WindowManager.LayoutParams.MATCH_PARENT;
        lp.height = ScreenUtils.dpToPx(178);

        //给 DecorView 设置背景颜色，很重要，不然导致 Dialog 内容显示不全，有一部分内容会充当 padding，上面例子有举出
        if (ReadSettingManager.getInstance().isNightMode()) {
            getWindow().getDecorView().setBackgroundColor(mContext.getResources().getColor(R.color.night_bg));
        } else {
            getWindow().getDecorView().setBackgroundColor(Color.WHITE);
        }
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        unbinder.unbind();
    }


    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    private void shareToFriend() {
        if (!wxApi.isWXAppInstalled()) {
            Toast.makeText(mContext, mContext.getString(R.string.weixin_not_install), Toast.LENGTH_SHORT).show();
            return;
        }
        MainApplication.getOpenNativePackage().openNativeModule.sendShareEvent("wechat", title, description, webpageUrl, thumbImage);
        dismiss();

        /*
        Glide.with(mContext.getApplicationContext()).load(thumbImage).asBitmap().into(new SimpleTarget<Bitmap>() {
            @Override
            public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                sendReq(SendMessageToWX.Req.WXSceneSession, resource);
                dismiss();
            }

            @Override
            public void onLoadFailed(Exception e, Drawable errorDrawable) {
                super.onLoadFailed(e, errorDrawable);
                sendReq(SendMessageToWX.Req.WXSceneSession, null);
                dismiss();
            }
        });
        */
    }

    private void shareToFriendCircle() {
        if (!wxApi.isWXAppInstalled()) {
            Toast.makeText(mContext, mContext.getString(R.string.weixin_not_install), Toast.LENGTH_SHORT).show();
            return;
        }
        MainApplication.getOpenNativePackage().openNativeModule.sendShareEvent("timeline", title, description, webpageUrl, thumbImage);
        dismiss();

        /*
        Glide.with(mContext.getApplicationContext()).load(thumbImage).asBitmap().into(new SimpleTarget<Bitmap>() {
            @Override
            public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                sendReq(SendMessageToWX.Req.WXSceneTimeline, resource);
                dismiss();
            }

            @Override
            public void onLoadFailed(Exception e, Drawable errorDrawable) {
                super.onLoadFailed(e, errorDrawable);
                sendReq(SendMessageToWX.Req.WXSceneTimeline, null);
                dismiss();
            }
        });
        */
    }

    private void shareToQQFriend(){
        if (!qqApi.isSupportSSOLogin((Activity) mContext)) {
            Toast.makeText(mContext, mContext.getString(R.string.qq_not_install), Toast.LENGTH_SHORT).show();
            return;
        }

        MainApplication.getOpenNativePackage().openNativeModule.sendShareEvent("qq", title, description, webpageUrl, thumbImage);
        dismiss();
    }

    private void shareToQQZone() {
        if (!qqApi.isSupportSSOLogin((Activity) mContext)) {
            Toast.makeText(mContext, mContext.getString(R.string.qq_not_install), Toast.LENGTH_SHORT).show();
            return;
        }

        MainApplication.getOpenNativePackage().openNativeModule.sendShareEvent("qqZone", title, description, webpageUrl, thumbImage);
        dismiss();
    }

    private void sendReq(int scene, Bitmap bitmap) {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = webpageUrl;

        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = "发现一本好书《"+ title + "》";
        String targetDescription = description;//.replaceAll("\\s*", "");
        if (targetDescription.length() >= 100) {
            targetDescription = targetDescription.substring(0, 100);
        }
        LogUtils.i("yy","sendReq des="+targetDescription);
        msg.description = targetDescription;
//      Bitmap thumb = BitmapFactory.decodeResource(getResources(), R.drawable.ic_night);
        if(bitmap == null) {
            msg.thumbData = null;
        } else {
            msg.thumbData = BitmapUtils.getStaticSizeBitmapByteByBitmap(bitmap, 32*1024);
        }
        LogUtils.i("yy","sendReq thumbData="+msg.thumbData.length);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        req.scene = scene;
        wxApi.sendReq(req);
        userSharePayment();
    }

    private void userSharePayment(){
        if(!TextUtils.isEmpty(token) && NetworkUtils.isAvailable(mContext)) {
            JSONObject root = new JSONObject();
            try {
                root.put("token", token);
                root.put("hotbeans_type", 9);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            LogUtils.i("yy", "userSharePayment root=" + root);
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
            RemoteRepository.getInstance().userSign(requestBody)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(new SingleObserver<SignBean>() {
                        Disposable disposable;

                        @Override
                        public void onSubscribe(Disposable d) {
                            disposable = d;
                        }

                        @Override
                        public void onSuccess(SignBean value) {
                            LogUtils.i("yy","userSharePayment onSuccess task_complete_state=" + value.isTask_complete_state());
                            if (!value.isTask_complete_state()) {
                                 String hotBeanStr = mContext.getResources().getString(R.string.share_get_hotbean, 10);
                                 Toast.makeText(getContext(), hotBeanStr, Toast.LENGTH_SHORT).show();
                            }

                            disposable.dispose();
                        }

                        @Override
                        public void onError(Throwable e) {
                            Log.i("yy", "userSharePayment onError e=" + e.toString());
                            disposable.dispose();
                        }
                    });
        }
    }
    //*/
}
