package com.droi.reader.wxapi;


import com.theweflex.react.WeChatModule;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import com.droi.reader.utils.Constant;
import com.droi.reader.utils.LogUtils;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
    private IWXAPI wxapi;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    wxapi = WXAPIFactory.createWXAPI(this, Constant.WX_APP_ID);
    wxapi.handleIntent(getIntent(), this);
    WeChatModule.handleIntent(getIntent());
    finish();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    wxapi.handleIntent(intent, this);
  }

  @Override
  public void onReq(BaseReq baseReq) {
        LogUtils.i("yy","onReq()-->baseResp.errCode="+baseReq.toString());
  }

  @Override
  public void onResp(BaseResp baseResp) {
        LogUtils.i("yy","onResp()-->baseResp.errCode="+baseResp.errCode);
      switch (baseResp.errCode) {
          // 正确返回
          case BaseResp.ErrCode.ERR_OK:
              switch (baseResp.getType()) {
                  // ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX是微信分享，api自带
                  case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                      // 只是做了简单的finish操作
                      finish();
                      break;
                  default:
                      break;
              }
              break;
          default:
              // 错误返回
              switch (baseResp.getType()) {
                  // 微信分享
                  case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                        LogUtils.i("yy" , ">>>errCode = " + baseResp.errCode);
                      finish();
                      break;
                  default:
                      break;
              }
              break;
      }

  }

}
