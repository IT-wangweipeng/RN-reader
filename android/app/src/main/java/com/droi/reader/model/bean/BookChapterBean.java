package com.droi.reader.model.bean;

import org.greenrobot.greendao.annotation.Entity;

import java.io.Serializable;
import org.greenrobot.greendao.annotation.Generated;
import org.greenrobot.greendao.annotation.Id;

/**
 * 书的章节链接(作为下载的进度数据)
 * 同时作为网络章节和本地章节 (没有找到更好分离两者的办法)
 */
@Entity
public class BookChapterBean implements Serializable {
    private static final long serialVersionUID = 56423411313L;

    /**
     * id : 18858
     * book_id : 10040
     * title : 第二十章 鬼虫子
     * create_time : 1552462183
     * sort : 14676862
     * word_count : 2007
     * isvip : 0
     */

    @Id
    private long id;
    private long book_id;
    private String title;
    private String create_time;
    private int sort;
    private int word_count;
    private int isvip;

    //所属的下载任务
    private String taskName;
    private boolean unreadble;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public String toString() {
        return "BookChapterBean{" +
                "id=" + id +
                ", book_id=" + book_id +
                ", title='" + title + '\'' +
                ", create_time='" + create_time + '\'' +
                ", sort=" + sort +
                ", word_count=" + word_count +
                ", isvip=" + isvip +
                ", taskName='" + taskName + '\'' +
                ", unreadble=" + unreadble +
                ", start=" + start +
                ", end=" + end +
                '}';
    }

    public boolean isUnreadble() {
        return unreadble;
    }

    public void setUnreadble(boolean unreadble) {
        this.unreadble = unreadble;
    }

    public long getStart() {
        return start;
    }

    public void setStart(long start) {
        this.start = start;
    }

    public long getEnd() {
        return end;
    }

    public void setEnd(long end) {
        this.end = end;
    }

    //本地书籍参数
    //在书籍文件中的起始位置
    private long start;
    //在书籍文件中的终止位置
    private long end;

    @Generated(hash = 1796676238)
    public BookChapterBean(long id, long book_id, String title, String create_time,
            int sort, int word_count, int isvip, String taskName, boolean unreadble,
            long start, long end) {
        this.id = id;
        this.book_id = book_id;
        this.title = title;
        this.create_time = create_time;
        this.sort = sort;
        this.word_count = word_count;
        this.isvip = isvip;
        this.taskName = taskName;
        this.unreadble = unreadble;
        this.start = start;
        this.end = end;
    }

    @Generated(hash = 853839616)
    public BookChapterBean() {
    }



    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
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

    public boolean getUnreadble() {
        return this.unreadble;
    }
}