<template lang="pug">
#app.container
  .row(v-if="status !== ''")
    h4(style="text-align: center") {{ status }}
  .row(v-if="task")
    h4 参与者列表
    p#avatars
      avatar(v-for="id in involvedMembers", @click="addReciever(id)", :name="projectMember[id].name", :url="projectMember[id].avatarUrl", :has-liked="hasLikedMembers.includes(id)")
    h4 发私聊催促
    h5 发送对象
    p#recievers
      span.label.label-primary(v-for="id in reminderMessage.recievers", @click="removeReciever(id)") {{ projectMember[id].name }}
    h5 发送内容
    .form-group
      textarea.form-control(rows="5", v-model="reminderMessage.content")
    .form-group.clearfix
      .btn.btn-primary.pull-right(@click="sendMessage()") 发送
</template>

<script>
import qs from 'querystring'

export default {
  data: function () {
    return {
      params: qs.parse(window.location.search.substr(1)),
      status: '加载中...',
      task: null,
      projectMember: {},
      involvedMembers: [],
      hasLikedMembers: [],
      reminderMessage: {
        recievers: [],
        content: ''
      }
    }
  },
  ready: function () {
    if (!this.params.task) {
      this.status = '未指定任务，请从任务菜单中打开插件'
      return
    }

    this.$api({
      url: `/tasks/${this.params.task}`,
      method: 'GET'
    }).then((res) => {
      this.task = res.json()

      this.$api({
        url: `/v2/projects/${this.task._projectId}/members`,
        method: 'GET'
      }).then((res) => {
        let members = res.json()
        this.projectMember = this.$_.keyBy(members, '_userId')
        this.involvedMembers = this.$_.intersection(this.task.involveMembers, Object.keys(this.projectMember))

        this.$api({
          url: `/tasks/${this.params.task}/like`,
          method: 'GET',
          params: { all: 1 }
        }).then((res) => {
          let likes = res.json().likesGroup
          this.hasLikedMembers = this.$_.intersection(this.$_.map(likes, '_id'), Object.keys(this.projectMember))
          this.reminderMessage.recievers = this.$_.difference(this.involvedMembers, this.hasLikedMembers)
          this.reminderMessage.content = `快来点赞任务「${this.task.content}」吧，就差你啦：https://www.teambition.com/project/${this.task._projectId}/tasks/scrum/${this.task._tasklistId}/task/${this.task._id}`

          this.status = ''
        })
      })
    })
  },
  methods: {
    addReciever: function (id) {
      this.reminderMessage.recievers = this.$_.union(this.reminderMessage.recievers, [id])
    },
    removeReciever: function (id) {
      this.reminderMessage.recievers = this.$_.difference(this.reminderMessage.recievers, [id])
    },
    sendMessage: function () {
      for (let id of this.reminderMessage.recievers) {
        this.$api({
          url: `/direct_messages/users/${id}`,
          method: 'POST',
          body: {
            content: this.reminderMessage.content
          }
        })
      }

      this.$tb.notify({
        isCI: false,
        origin: `${window.location.protocol}//${window.location.host}`,
        params: {
          status: 'success',
          message: '发送成功'
        }
      })
    }
  },
  components: {
    avatar: require('components/Avatar')
  }
}
</script>

<style lang="scss">
#app {
  user-select: none;
}

#avatars {
  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  .avatar { cursor: pointer; }
}

#recievers span.label {
  display: inline-block;
  margin: 3px 2px;
  padding: 4px 6px;

  font-size: 100%;
  cursor: pointer;

  &:hover::after {
    content: ' x';
  }
}
</style>
