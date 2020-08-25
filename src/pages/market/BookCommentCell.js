import React, {Component} from 'react';
import {
  Image, Text, TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types';
import {isToday, isYesterday} from "../../utils/TimeUtil";
import moment from "moment";
import images from "../../component/images";

class BookCommentCell extends Component {

  render() {
    const {item, canDelete} = this.props
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'column',
        }}
        onPress={()=>{
          this.props.onPressCell && this.props.onPressCell()
        }}
      >
        <View style={styles.viewWrapper}>

          <View>
            {
              (item && item.is_vip === 1) ? (
                <Image
                  source={images.vip_crown}
                  style={{marginLeft: 16, width: 14, height: 14}}
                />
              ) : null
            }

            <Image
              defaultSource={images.image_avatar_placeholder}
              source={ item.pic ? {uri: item.pic, cache: 'force-cache'} : images.image_avatar_placeholder}
              style={[styles.avatar, {marginTop: -5}]}
            />
          </View>

          {/*<View style={[styles.avatar, {overflow:'hidden', marginTop: -4, backgroundColor: 'red'}]}>*/}
          {/*<Image*/}
          {/*  defaultSource={images.image_avatar_placeholder}*/}
          {/*  source={ item.pic ? {uri: item.pic} : images.image_avatar_placeholder}*/}
          {/*  style={styles.avatar}*/}
          {/*/>*/}
          {/*</View>*/}
          <View style={{flex: 1,}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                <Text style={styles.nickname}>
                  {`${item.nickname || ''}`}
                </Text>

                {
                  (item && item.is_vip === 1) ? (
                    <Image
                      source={images.vip}
                      style={{marginLeft: 5, width: 18, height: 10}}
                    />
                  ) : null
                }

              </View>
              {
                (item.is_self_comments || canDelete) ? (
                  <TouchableOpacity
                    style={{justifyContent: 'center', height: 18, alignItems: 'center'}}
                    onPress={() => {
                      this.props.deleteComment && this.props.deleteComment(item)
                    }}
                  >
                    <Text
                      style={{fontSize: 12, color: '#A0A0A0', textAlign: 'right'}}
                    >
                      {'  删除'}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }

            </View>



            {
              this._renderContent(item)
            }

            <View style={styles.timeWrapper}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#949BA5',
                }}
              >
                {item.ts ? (isToday(item.ts) && moment.unix(item.ts).format('H:mm') || isYesterday(item.ts) && `昨天${moment.unix(item.ts).format('H:mm')}` || `${moment.unix(item.ts).format('YYYY年MM月DD日')}`) : ' '}
              </Text>

              <View style={{flexDirection: 'row'}}>
                {/*回复数*/}
                {
                  this.props.hiddenReplyButton ? null : (
                    <TouchableOpacity
                      onPress={()=>{
                        this.props.onPressReply && this.props.onPressReply(item)
                      }}
                      style={styles.replyButton}
                    >
                      <Image
                        style={{width: 13, height: 11,}}
                        source={images.image_comment_message}
                      />
                      <Text style={styles.replyText}>
                        {item.reply_num === 0 ? '回复' : `${item.reply_num}`}
                      </Text>
                    </TouchableOpacity>
                  )
                }


                {/*点赞数*/}
                <TouchableOpacity
                  onPress={()=>{
                    this.props.onPressPraise && this.props.onPressPraise(item)
                  }}
                  style={styles.likeButton}
                >
                  <Image
                    style={{marginLeft: 30, width: 13, height: 11,}}
                    source={item.is_praise ? images.image_comment_praise_select : images.image_comment_praise_unselect}
                  />
                  <Text style={styles.likeText}>
                    {`${item.praise_num || '0'}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderContent = (item) => {
    if (item.reply_level === 2) {
      return (
        <Text
          style={styles.content}
          numberOfLines={4}
          ellipsizeMode={'tail'}
        >
          {`${item.content} //`}
          <Text style={[styles.content, {color: '#F85733'}]}>
            {`@${item.replyed_username} `}
            <Text style={styles.content}>
              {`${item.replyed_comment}`}
            </Text>
          </Text>
        </Text>
      )
    }

    return (
      <Text
        style={styles.content}
        numberOfLines={4}
        ellipsizeMode={'tail'}
      >
        {`${item.content || ''}`}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  viewWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingTop: 20,
  },
  content: {
    marginTop: 10,
    fontSize: 14,
    color: '#545C67',
    lineHeight: 24,
    marginLeft: 10,
  },
  timeWrapper: {
    marginLeft: 10,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyButton: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
  },
  replyText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#A0A0A0',
  },
  likeButton: {
    height: 40,
    alignItems:'center',
    flexDirection: 'row',
  },
  likeText: {
    marginStart: 8,
    fontSize: 12,
    color: '#A0A0A0'
  },
  nickname: {
    fontSize: 15,
    marginLeft: 10,
    color: '#1e252f'
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff'
  }
})

BookCommentCell.propTypes = {};

export default BookCommentCell;
