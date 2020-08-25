package com.droi.reader.model.bean;


import java.util.ArrayList;

public class MusicBean {


    /**
     * list : [{"name":"男男女女","url":"http://music.163.com/song/media/outer/url?id=1318234987.mp3","sort":99},{"name":"真好听啊","url":"http://music.163.com/song/media/outer/url?id=566443207.mp3","sort":99},{"name":"aaa","url":"http://music.163.com/song/media/outer/url?id=1318234987.mp3","sort":100},{"name":"mmmm","url":"http://music.163.com/song/media/outer/url?id=566443207.mp3","sort":101},{"name":"trtrtr","url":"http://music.163.com/song/media/outer/url?id=1318234987.mp3","sort":102}]
     * hasMore : true
     * last_sort : 102
     */

    private boolean hasMore;
    private int last_sort;
    private ArrayList<ListBean> list;

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }

    public int getLast_sort() {
        return last_sort;
    }

    public void setLast_sort(int last_sort) {
        this.last_sort = last_sort;
    }

    public ArrayList<ListBean> getList() {
        return list;
    }

    public void setList(ArrayList<ListBean> list) {
        this.list = list;
    }

    public static class ListBean {
        /**
         * name : 男男女女
         * url : http://music.163.com/song/media/outer/url?id=1318234987.mp3
         * sort : 99
         */

        private String name;
        private String url;
        private int sort;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public int getSort() {
            return sort;
        }

        public void setSort(int sort) {
            this.sort = sort;
        }
    }
}
