package com.droi.reader.widget.page;

public class TxtChapter{

    //章节所属的小说(网络)
    long bookId;
    //章节的链接(网络)
    long id;

    //章节名(共用)
    String title;

    int sort;

    int isvip;

    public int getIsvip() {
        return isvip;
    }

    public void setIsvip(int isvip) {
        this.isvip = isvip;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }

    public long getBookId() {
        return bookId;
    }

    public void setBookId(long id) {
        this.bookId = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "TxtChapter{" +
                "bookId=" + bookId +
                ", id=" + id +
                ", title='" + title + '\'' +
                ", sort=" + sort +
                ", isvip=" + isvip +
                '}';
    }
}
