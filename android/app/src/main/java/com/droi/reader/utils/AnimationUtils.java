package com.droi.reader.utils;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;

public class AnimationUtils {
    public enum AnimationState{
        STATE_SHOW,
        STATE_HIDDEN
    }
    /**
     * 渐隐渐现动画
     * @param view 需要实现动画的对象
     * @param state 需要实现的状态
     * @param duration 动画实现的时长（ms）
     */
    public static void showAndHiddenAnimation(final View view,AnimationState state,long duration){
        float start = 0f;
        float end = 0f;
        if(state == AnimationState.STATE_SHOW){
            end = 1f;
            view.setVisibility(View.VISIBLE);
        } else
        if(state == AnimationState.STATE_HIDDEN){
            start = 1f;
            view.setVisibility(View.INVISIBLE);
        }
        AlphaAnimation animation = new AlphaAnimation(start, end);
        animation.setDuration(duration);
        animation.setFillAfter(true);
        animation.setAnimationListener(new AnimationListener() {

            @Override
            public void onAnimationStart(Animation animation) {
                LogUtils.i("yy","onAnimationStart");
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
                LogUtils.i("yy","onAnimationRepeat");
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                LogUtils.i("yy","onAnimationEnd");
                view.clearAnimation();
            }
        });
        view.setAnimation(animation);
        animation.start();
    }

}
