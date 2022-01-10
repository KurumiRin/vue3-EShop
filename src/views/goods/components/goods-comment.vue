<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <!-- <a href="javascript:;" class="active">全部评价（{{commentInfo.evaluateCount}}）</a>
          <a href="javascript:;">有图（{{commentInfo.hasPictureCount}}）</a> -->
          <a href="javascript:;" v-for="(item,index) in commentInfo.tags" :key="item.title" :class="{active: currentIndex === index}" @click="changeTag(index)">{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:reqParams.sortField===null}">默认</a>
      <a @click="changeSort('praiseCount')" href="javascript:;" :class="{active:reqParams.sortField==='praiseCount'}">最热</a>
      <a @click="changeSort('createTime')" href="javascript:;" :class="{active:reqParams.sortField==='createTime'}">最新</a>
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="v in item.score" :key="v"></i>
            <i class="iconfont icon-wjx02" v-for="v in 5 - item.score" :key="v"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <!-- 评论内容 -->
          <div class="text">{{item.content}}</div>
          <!-- 渲染商品图片 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <!-- 评论时间 -->
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>

    </div>
    <!-- 分页 -->
    <div class="xtx-pagination" v-if="total>0">
      <XtxPagination @current-change="changePager" :total="total" :current-page="reqParams.page"></XtxPagination>
    </div>
  </div>
</template>
<script>
import { ref, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { findCommentInfoByGoods, findCommentListByGoods } from '@/api/goods'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup() {
    const route = useRoute()
    const commentInfo = ref({})
    watch(
      () => route.params.id,
      (value) => {
        findCommentInfoByGoods(value).then(res => {
          res.result.tags.unshift({ title: '有图', tagCount: commentInfo.value.hasPictureCount })
          res.result.tags.unshift({ title: '全部评价', tagCount: commentInfo.value.salesCount })
          commentInfo.value = res.result
        })
      },
      {
        immediate: true
      }
    )

    // 默认高亮的下标
    const currentIndex = ref(0)

    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: false,
      tag: null,
      sortField: null,
      sortMethod: 'desc'
    })

    // 改变排序
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }

    // 点击tag
    const changeTag = index => {
      currentIndex.value = index
      // 修改reqParams的值
      if (index === 0) {
        // 点击了全部评价
        reqParams.hasPicture = false
        reqParams.tag = null
      } else if (index === 1) {
        // 点击有图
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        // 点击其他tag
        reqParams.hasPicture = false
        reqParams.tag = commentInfo.value.tags[index].title
      }
      reqParams.page = 1
    }

    const commentList = ref([])
    const total = ref(0)

    watch([reqParams, () => route.params.id], () => {
      findCommentListByGoods(route.params.id, reqParams).then((res) => {
        commentList.value = res.result.items
        total.value = res.result.counts
      })
    }, {
      immediate: true
    })

    const formatNickname = (nickname) => {
      return nickname.slice(0, 1) + '*****' + nickname.slice(-1)
    }

    const formatSpecs = specs => {
      return specs.reduce((prev, item) => `${prev} ${item.name}:${item.nameValue}`, '')
    }

    // 改变分页函数
    const changePager = (np) => {
      reqParams.page = np
    }

    return {
      commentInfo,
      currentIndex,
      reqParams,
      changeSort,
      changeTag,
      commentList,
      formatNickname,
      formatSpecs,
      total,
      changePager
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
