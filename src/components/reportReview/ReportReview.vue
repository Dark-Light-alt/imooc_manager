<template>
  <div class="reportReview">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">举报管理</el-breadcrumb-item>
      <el-breadcrumb-item>举报审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="视频审核" name="0">
          <el-table :data="reportReviewList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="任务 ID">
                    <span>{{ scope.row.taskId }}</span>
                  </el-form-item>
                  <el-form-item label="视频名称">
                    <span>{{ scope.row.video.videoName }}</span>
                  </el-form-item>
                  <el-form-item label="视频">
                    <video :src="scope.row.video.videoUrl" height="150px" width="250px" controls></video>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="reportReason.reportReasonName" label="举报原因"></el-table-column>
            <el-table-column prop="reportTime" label="举报时间"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reviewStatus == 0" type="warning">未审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 1">待审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 2" type="success">已审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewResult" label="处理结果"></el-table-column>
            <el-table-column prop="reviewTime" label="审核时间">
              <template slot-scope="scope">
                {{scope.row.reviewTime !== null ? scope.row.reviewTime : 'N/A'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="评论审核" name="1">
          <el-table :data="reportReviewList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="评论内容">
                    <span>{{scope.row.comments.content}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="reportReason.reportReasonName" label="举报原因"></el-table-column>
            <el-table-column prop="reportTime" label="举报时间"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reviewStatus == 0" type="warning">未审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 1">待审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 2" type="success">已审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewResult" label="处理结果"></el-table-column>
            <el-table-column prop="reviewTime" label="审核时间">
              <template slot-scope="scope">
                {{scope.row.reviewTime !== null ? scope.row.reviewTime : 'N/A'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="问题审核" name="2">
          <el-table :data="reportReviewList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="问题标题">
                    <span>{{scope.row.question.title}}</span>
                  </el-form-item>
                  <el-form-item label="问题内容">
                    <span>{{scope.row.question.content}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="reportReason.reportReasonName" label="举报原因"></el-table-column>
            <el-table-column prop="reportTime" label="举报时间"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reviewStatus == 0" type="warning">未审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 1">待审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 2" type="success">已审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewResult" label="处理结果"></el-table-column>
            <el-table-column prop="reviewTime" label="审核时间">
              <template slot-scope="scope">
                {{scope.row.reviewTime !== null ? scope.row.reviewTime : 'N/A'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="回答审核" name="3">
          <el-table :data="reportReviewList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="回答内容">
                    <span>{{scope.row.answer.content}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="reportReason.reportReasonName" label="举报原因"></el-table-column>
            <el-table-column prop="reportTime" label="举报时间"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reviewStatus == 0" type="warning">未审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 1">待审核</el-tag>
                <el-tag v-if="scope.row.reviewStatus == 2" type="success">已审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewResult" label="处理结果"></el-table-column>
            <el-table-column prop="reviewTime" label="审核时间">
              <template slot-scope="scope">
                {{scope.row.reviewTime !== null ? scope.row.reviewTime : 'N/A'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'ReportReview',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          lastPage: 0,
          searchs: {},
          flag: true
        },
        activeName: '0',
        reportReviewList: []
      }
    },
    methods: {
      handleClick: function (tab, event) {
        this.activeName = tab.name
        this.findAll()
      },
      findAll: async function () {
        const { data: res } = await this.$http.post('ReportReviewController/findAll', {
          pages: this.pages,
          reportType: this.activeName
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.reportReviewList = res.data.reportReviewList
        this.pages = res.pages
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findAll()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style scoped>

</style>
