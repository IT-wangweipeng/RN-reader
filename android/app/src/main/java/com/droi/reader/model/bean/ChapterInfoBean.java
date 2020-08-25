package com.droi.reader.model.bean;

public class ChapterInfoBean {
    /**
     * chapter_id : 18858
     * book_id : 10040
     * title : 第二十章 鬼虫子
     * content :       “你要是闲得没事就赶紧去看着你家女朋去。别在这儿添乱”明玉扭头吼道，一边把我塞回屋里，顺手揪住想跟着我窜进去的洛冥殇。
     紧接着又是三颗绿色的弹珠飞了过来，我赶紧单手一个反手，将所有弹珠接住，猛地一推，所有弹珠飞回去。“鬼虫弹。”我轻轻喊了出来，在圈子里，以炼制虫子作为武器的修炼之人不在少数，但是能培育鬼虫，并将鬼虫炼成这种鬼虫弹的，我知道的，只有一个人。“鬼虫子，王宇。”
     * create_time : 1552462183
     * word_count : 2007
     * isvip : 0
     */

    private long chapter_id;
    private long book_id;
    private String title;
    private String content;
    private String create_time;
    private int word_count;
    private int isvip;

    public long getChapter_id() {
        return chapter_id;
    }

    public void setChapter_id(long chapter_id) {
        this.chapter_id = chapter_id;
    }

    public long getBook_id() {
        return book_id;
    }

    public void setBook_id(long book_id) {
        this.book_id = book_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public int getWord_count() {
        return word_count;
    }

    public void setWord_count(int word_count) {
        this.word_count = word_count;
    }

    public int getIsvip() {
        return isvip;
    }

    public void setIsvip(int isvip) {
        this.isvip = isvip;
    }
}
