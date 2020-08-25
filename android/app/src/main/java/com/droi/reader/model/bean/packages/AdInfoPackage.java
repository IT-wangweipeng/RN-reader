package com.droi.reader.model.bean.packages;

import java.util.List;

public class AdInfoPackage {

    @Override
    public String toString() {
        return "AdInfoPackage{" +
                "success=" + success +
                ", search_id='" + search_id + '\'' +
                ", ad_source=" + ad_source +
                ", ad_return_empty_reason='" + ad_return_empty_reason + '\'' +
                ", error_code='" + error_code + '\'' +
                ", ads=" + ads +
                '}';
    }

    /**
     * success : true
     * ads : [{"adslot_id":"s0dc613db","type":4,"material_type":1,"html_snippet":"","native_material":{"id":314,"title":"ADroi","description":"品牌客户解决方案","video":null,"native_material_type":2,"adicon":"http://adroi.cdn.bcebos.com/cdn/images/adicon.png","adlogo":"http://adroi.cdn.bcebos.com/cdn/images/adlogo.png","interaction_type":2,"image_url":"http://adroi.cdn.bcebos.com/cdn/campaign/1/NATIVE_IMAGE/46145345084160890_536104750_657b46a2.jpg","image_size":{"width":600,"height":500},"logo_url":"http://adroi.cdn.bcebos.com/cdn/campaign/1/ICON_IMAGE/48557465942574879_1501846263_a29474f7.jpg","ext_image_url":[],"logo_size":{"width":162,"height":162},"click_url":"http://adroi.bj.bcebos.com/cdn/other/kuaitoutiao.apk","landing_page":"","impression_log_url":["http://ads.adroi.com.cn/view.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"],"click_monitor_url":["http://ads.adroi.com.cn/click.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb&co=1&aco=__ABSOLUTE_COORD__"],"app_name":"","video_url":"","video_duration":0,"app_pkg":"com.freeme.widget.newspage","app_download":["http://ads.adroi.com.cn/download.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"],"app_download_start":[],"app_install":[],"app_install_start":[],"app_active":[],"app_size":"","app_deep_link":[],"app_open":[],"ad_tracking":[],"ad_playtracker":null}}]
     * search_id : 23eb21f65226fc5f2b106a27e6ae0912
     * ad_source : 0
     * ad_return_empty_reason :
     * error_code : 0
     */

    private boolean success;
    private String search_id;
    private int ad_source;
    private String ad_return_empty_reason;
    private String error_code;
    private List<AdsBean> ads;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getSearch_id() {
        return search_id;
    }

    public void setSearch_id(String search_id) {
        this.search_id = search_id;
    }

    public int getAd_source() {
        return ad_source;
    }

    public void setAd_source(int ad_source) {
        this.ad_source = ad_source;
    }

    public String getAd_return_empty_reason() {
        return ad_return_empty_reason;
    }

    public void setAd_return_empty_reason(String ad_return_empty_reason) {
        this.ad_return_empty_reason = ad_return_empty_reason;
    }

    public String getError_code() {
        return error_code;
    }

    public void setError_code(String error_code) {
        this.error_code = error_code;
    }

    public List<AdsBean> getAds() {
        return ads;
    }

    public void setAds(List<AdsBean> ads) {
        this.ads = ads;
    }

    public static class AdsBean {
        /**
         * adslot_id : s0dc613db
         * type : 4
         * material_type : 1
         * html_snippet :
         * native_material : {"id":314,"title":"ADroi","description":"品牌客户解决方案","video":null,"native_material_type":2,"adicon":"http://adroi.cdn.bcebos.com/cdn/images/adicon.png","adlogo":"http://adroi.cdn.bcebos.com/cdn/images/adlogo.png","interaction_type":2,"image_url":"http://adroi.cdn.bcebos.com/cdn/campaign/1/NATIVE_IMAGE/46145345084160890_536104750_657b46a2.jpg","image_size":{"width":600,"height":500},"logo_url":"http://adroi.cdn.bcebos.com/cdn/campaign/1/ICON_IMAGE/48557465942574879_1501846263_a29474f7.jpg","ext_image_url":[],"logo_size":{"width":162,"height":162},"click_url":"http://adroi.bj.bcebos.com/cdn/other/kuaitoutiao.apk","landing_page":"","impression_log_url":["http://ads.adroi.com.cn/view.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"],"click_monitor_url":["http://ads.adroi.com.cn/click.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb&co=1&aco=__ABSOLUTE_COORD__"],"app_name":"","video_url":"","video_duration":0,"app_pkg":"com.freeme.widget.newspage","app_download":["http://ads.adroi.com.cn/download.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"],"app_download_start":[],"app_install":[],"app_install_start":[],"app_active":[],"app_size":"","app_deep_link":[],"app_open":[],"ad_tracking":[],"ad_playtracker":null}
         */

        private String adslot_id;
        private int type;
        private int material_type;
        private String html_snippet;
        private NativeMaterialBean native_material;

        public String getAdslot_id() {
            return adslot_id;
        }

        public void setAdslot_id(String adslot_id) {
            this.adslot_id = adslot_id;
        }

        public int getType() {
            return type;
        }

        public void setType(int type) {
            this.type = type;
        }

        public int getMaterial_type() {
            return material_type;
        }

        public void setMaterial_type(int material_type) {
            this.material_type = material_type;
        }

        public String getHtml_snippet() {
            return html_snippet;
        }

        public void setHtml_snippet(String html_snippet) {
            this.html_snippet = html_snippet;
        }

        public NativeMaterialBean getNative_material() {
            return native_material;
        }

        public void setNative_material(NativeMaterialBean native_material) {
            this.native_material = native_material;
        }

        public static class NativeMaterialBean {
            /**
             * id : 314
             * title : ADroi
             * description : 品牌客户解决方案
             * video : null
             * native_material_type : 2
             * adicon : http://adroi.cdn.bcebos.com/cdn/images/adicon.png
             * adlogo : http://adroi.cdn.bcebos.com/cdn/images/adlogo.png
             * interaction_type : 2
             * image_url : http://adroi.cdn.bcebos.com/cdn/campaign/1/NATIVE_IMAGE/46145345084160890_536104750_657b46a2.jpg
             * image_size : {"width":600,"height":500}
             * logo_url : http://adroi.cdn.bcebos.com/cdn/campaign/1/ICON_IMAGE/48557465942574879_1501846263_a29474f7.jpg
             * ext_image_url : []
             * logo_size : {"width":162,"height":162}
             * click_url : http://adroi.bj.bcebos.com/cdn/other/kuaitoutiao.apk
             * landing_page :
             * impression_log_url : ["http://ads.adroi.com.cn/view.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"]
             * click_monitor_url : ["http://ads.adroi.com.cn/click.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb&co=1&aco=__ABSOLUTE_COORD__"]
             * app_name :
             * video_url :
             * video_duration : 0
             * app_pkg : com.freeme.widget.newspage
             * app_download : ["http://ads.adroi.com.cn/download.shtml?c=nHD1nHnzP1b4Pg39fan2cjc1uycznymvPHczPhuWPymzmWDsPhDzPvRvmyRsrHDzD0Dm0i0026fsQW0sn6fzPjnvrn2JaDc6n1TvnvD4ujnLPAcvnAuhPvFbuW-9uWPbmWPWuyfzmyF20WmLR6n1nHwp0HKBjHmkQWDdnB3vPB3knHwC0ZjjEtrtsC5a6_26QgC5rjm3njcYnjcYn1c1PjmzsC0Ks45aM_2psJnZsCCK0WTdsGcKKj08njjah6DRRAq1IAd9U-FdUMwGUyREPz3vQWZaC0Zjh0HaJ0ZjV05a_6D0soCK0HjjB6D5rjm3njcYnjcYn1c1PjmzxB70czfb"]
             * app_download_start : []
             * app_install : []
             * app_install_start : []
             * app_active : []
             * app_size :
             * app_deep_link : []
             * app_open : []
             * ad_tracking : []
             * ad_playtracker : null
             */

            private int id;
            private String title;
            private String description;
            private Object video;
            private int native_material_type;
            private String adicon;
            private String adlogo;
            private int interaction_type;
            private String image_url;
            private ImageSizeBean image_size;
            private String logo_url;
            private LogoSizeBean logo_size;
            private String click_url;
            private String landing_page;
            private String app_name;
            private String video_url;
            private int video_duration;
            private String app_pkg;
            private String app_size;
            private Object ad_playtracker;
            private List<?> ext_image_url;
            private List<String> impression_log_url;
            private List<String> click_monitor_url;
            private List<String> app_download;
            private List<String> app_download_start;
            private List<?> app_install;
            private List<?> app_install_start;
            private List<?> app_active;
            private List<?> app_deep_link;
            private List<?> app_open;
            private List<?> ad_tracking;

            public int getId() {
                return id;
            }

            public void setId(int id) {
                this.id = id;
            }

            public String getTitle() {
                return title;
            }

            public void setTitle(String title) {
                this.title = title;
            }

            public String getDescription() {
                return description;
            }

            public void setDescription(String description) {
                this.description = description;
            }

            public Object getVideo() {
                return video;
            }

            public void setVideo(Object video) {
                this.video = video;
            }

            public int getNative_material_type() {
                return native_material_type;
            }

            public void setNative_material_type(int native_material_type) {
                this.native_material_type = native_material_type;
            }

            public String getAdicon() {
                return adicon;
            }

            public void setAdicon(String adicon) {
                this.adicon = adicon;
            }

            public String getAdlogo() {
                return adlogo;
            }

            public void setAdlogo(String adlogo) {
                this.adlogo = adlogo;
            }

            public int getInteraction_type() {
                return interaction_type;
            }

            public void setInteraction_type(int interaction_type) {
                this.interaction_type = interaction_type;
            }

            public String getImage_url() {
                return image_url;
            }

            public void setImage_url(String image_url) {
                this.image_url = image_url;
            }

            public ImageSizeBean getImage_size() {
                return image_size;
            }

            public void setImage_size(ImageSizeBean image_size) {
                this.image_size = image_size;
            }

            public String getLogo_url() {
                return logo_url;
            }

            public void setLogo_url(String logo_url) {
                this.logo_url = logo_url;
            }

            public LogoSizeBean getLogo_size() {
                return logo_size;
            }

            public void setLogo_size(LogoSizeBean logo_size) {
                this.logo_size = logo_size;
            }

            public String getClick_url() {
                return click_url;
            }

            public void setClick_url(String click_url) {
                this.click_url = click_url;
            }

            public String getLanding_page() {
                return landing_page;
            }

            public void setLanding_page(String landing_page) {
                this.landing_page = landing_page;
            }

            public String getApp_name() {
                return app_name;
            }

            public void setApp_name(String app_name) {
                this.app_name = app_name;
            }

            public String getVideo_url() {
                return video_url;
            }

            public void setVideo_url(String video_url) {
                this.video_url = video_url;
            }

            public int getVideo_duration() {
                return video_duration;
            }

            public void setVideo_duration(int video_duration) {
                this.video_duration = video_duration;
            }

            public String getApp_pkg() {
                return app_pkg;
            }

            public void setApp_pkg(String app_pkg) {
                this.app_pkg = app_pkg;
            }

            public String getApp_size() {
                return app_size;
            }

            public void setApp_size(String app_size) {
                this.app_size = app_size;
            }

            public Object getAd_playtracker() {
                return ad_playtracker;
            }

            public void setAd_playtracker(Object ad_playtracker) {
                this.ad_playtracker = ad_playtracker;
            }

            public List<?> getExt_image_url() {
                return ext_image_url;
            }

            public void setExt_image_url(List<?> ext_image_url) {
                this.ext_image_url = ext_image_url;
            }

            public List<String> getImpression_log_url() {
                return impression_log_url;
            }

            public void setImpression_log_url(List<String> impression_log_url) {
                this.impression_log_url = impression_log_url;
            }

            public List<String> getClick_monitor_url() {
                return click_monitor_url;
            }

            public void setClick_monitor_url(List<String> click_monitor_url) {
                this.click_monitor_url = click_monitor_url;
            }

            public List<String> getApp_download() {
                return app_download;
            }

            public void setApp_download(List<String> app_download) {
                this.app_download = app_download;
            }

            public List<String> getApp_download_start() {
                return app_download_start;
            }

            public void setApp_download_start(List<String> app_download_start) {
                this.app_download_start = app_download_start;
            }

            public List<?> getApp_install() {
                return app_install;
            }

            public void setApp_install(List<?> app_install) {
                this.app_install = app_install;
            }

            public List<?> getApp_install_start() {
                return app_install_start;
            }

            public void setApp_install_start(List<?> app_install_start) {
                this.app_install_start = app_install_start;
            }

            public List<?> getApp_active() {
                return app_active;
            }

            public void setApp_active(List<?> app_active) {
                this.app_active = app_active;
            }

            public List<?> getApp_deep_link() {
                return app_deep_link;
            }

            public void setApp_deep_link(List<?> app_deep_link) {
                this.app_deep_link = app_deep_link;
            }

            public List<?> getApp_open() {
                return app_open;
            }

            public void setApp_open(List<?> app_open) {
                this.app_open = app_open;
            }

            public List<?> getAd_tracking() {
                return ad_tracking;
            }

            public void setAd_tracking(List<?> ad_tracking) {
                this.ad_tracking = ad_tracking;
            }

            public static class ImageSizeBean {
                /**
                 * width : 600
                 * height : 500
                 */

                private int width;
                private int height;

                public int getWidth() {
                    return width;
                }

                public void setWidth(int width) {
                    this.width = width;
                }

                public int getHeight() {
                    return height;
                }

                public void setHeight(int height) {
                    this.height = height;
                }
            }

            public static class LogoSizeBean {
                /**
                 * width : 162
                 * height : 162
                 */

                private int width;
                private int height;

                public int getWidth() {
                    return width;
                }

                public void setWidth(int width) {
                    this.width = width;
                }

                public int getHeight() {
                    return height;
                }

                public void setHeight(int height) {
                    this.height = height;
                }
            }
        }
    }
}
