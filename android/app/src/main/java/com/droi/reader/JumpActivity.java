package com.droi.reader;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;

import com.droi.reader.model.bean.CollBookBean;
import com.droi.reader.model.local.BookRepository;
import com.droi.reader.ui.activity.ReadActivity;
import com.droi.reader.ui.activity.SplashActivity;
import com.droi.reader.ui.activity.StartupActivity;
import com.droi.reader.utils.LogUtils;

public class JumpActivity extends AppCompatActivity {
    private Button mJump;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jump);
        mJump = findViewById(R.id.jump);

        mJump.setOnClickListener(view -> {
            Intent intent = new Intent(this, ReadActivity.class);
            CollBookBean bean = createCollBookBean();
            intent.putExtra(ReadActivity.EXTRA_COLL_BOOK, bean);
            intent.putExtra(ReadActivity.EXTRA_IS_COLLECTED, false);
            intent.putExtra(ReadActivity.EXTRA_SEX, 1);
//            intent.putExtra(ReadActivity.EXTRA_TOKEN, "2A170CA2B01F802BA823");
            startActivity(intent);
        });

        if (StartupActivity.instance != null && !StartupActivity.instance.isDestroyed()) {
            StartupActivity.instance.finish();
        }

        if (SplashActivity.instance != null && !SplashActivity.instance.isDestroyed()) {
            SplashActivity.instance.finish();
        }

    }


    public CollBookBean createCollBookBean() {
        CollBookBean bean = new CollBookBean();
        bean.setId(10027);
        bean.setName("野蛮女上司");
        bean.setCover("http://i.mixs.cn/upload/cover/146/146231/146231l.jpg");
//        bean.setSpecialChapterPos(3);
        bean.setComplete_status(1);
        bean.setChapter_count(517);


//        bean.setAuthor("二爷");
//        bean.setBrief("灵馆是转为死人缔结阴婚的古玩店，某天一个危险的陌生人的到来，无意间给灵馆的主人朔瞳雪也带来了一段姻缘，以及以后无尽的麻烦。");
//        bean.setCover("http://i.mixs.cn/upload/cover/146/146231/146231l.jpg");
//        bean.setChapter_count(863);
//        bean.setHasCp(true);
//        bean.setLatelyFollower(82724);
//        bean.setRetentionRatio(Double.parseDouble("58.36"));
//        bean.setUpdated("2019-03-24T22:17:42.496Z");
//        bean.setChaptersCount(521);
//        bean.setLastChapter("第八卷 思无邪 第五百一十八章 世事如棋局局新");

        return bean;
    }

}
