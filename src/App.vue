<template lang="pug">
#app
  h2(style="text-align: center") {{ status }}
  template(v-if="task")
    h3 参与者列表
    .avatars
      avatar(v-for="id in involvedMembers", @click="addReciever(id)", :name="projectMember[id].name", :url="projectMember[id].avatarUrl", :has-liked="hasLikedMembers.includes(id)")
    h3 发私聊催促
    p 发送对象
    span.reciever(v-for="id in reminderMessage.recievers", @click="removeReciever(id)") {{ projectMember[id].name }}
    p 发送内容
    textarea(rows="5", v-model="reminderMessage.content")
    .button(@click="sendMessage()") 发送
</template>

<script>
import qs from 'querystring'
import _ from 'lodash'
import * as sdk from 'tb-apps-sdk'

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

    this.$http({
      url: `https://api.teambition.com/api/tasks/${this.params.task}`,
      method: 'GET',
      params: {
        access_token: this.access_token
      }
    }).then((res) => {
      this.task = res.json()

      this.$http({
        url: `https://api.teambition.com/api/v2/projects/${this.task._projectId}/members`,
        method: 'GET',
        params: {
          access_token: this.access_token
        }
      }).then((res) => {
        let members = res.json()
        this.projectMember = _.zipObject(_.map(members, '_id'), members)
        this.involvedMembers = _.intersection(this.task.involveMembers, Object.keys(this.projectMember))

        this.$http({
          url: `https://api.teambition.com/api/tasks/${this.params.task}/like`,
          method: 'GET',
          params: {
            all: 1,
            access_token: this.access_token
          }
        }).then((res) => {
          let likes = res.json().likesGroup
          this.hasLikedMembers = _.intersection(_.map(likes, '_id'), Object.keys(this.projectMember))
          this.reminderMessage.recievers = _.difference(this.involvedMembers, this.hasLikedMembers)
          this.reminderMessage.content = `快来点赞任务「${this.task.content}」吧，就差你啦：https://www.teambition.com/project/${this.task._projectId}/tasks/scrum/${this.task._tasklistId}/task/${this.task._id}`

          this.status = ''
        })
      })
    })
  },
  methods: {
    addReciever: function (id) {
      this.reminderMessage.recievers = _.union(this.reminderMessage.recievers, [id])
    },
    removeReciever: function (id) {
      this.reminderMessage.recievers = _.difference(this.reminderMessage.recievers, [id])
    },
    sendMessage: function () {
      for (let id of this.reminderMessage.recievers) {
        this.$http({
          url: `https://api.teambition.com/api/direct_messages/users/${id}`,
          method: 'POST',
          params: {
            access_token: this.access_token
          },
          body: {
            content: this.reminderMessage.content
          }
        })
      }

      sdk.notify({
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
.text-center {
  text-align: center;
}

#app {
  font-size: 14px;
  user-select: none;

  .avatars {
    display: flex;
    flex-direction: row;

    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;

    .avatar { cursor: pointer; }
  }

  .reciever {
    display: inline-block;

    height: 20px;
    margin: 1px;
    padding: 3px 5px;

    cursor: pointer;

    border-radius: 10px;
    background-color: #efefef;

    font-size: 14px;
    line-height: 20px;

    &:hover::after {
      content: ' ×';
    }
  }

  textarea {
    width: 100%;
  }

  .button {
    float: right;
    margin: 10px 0;
    padding: 5px 20px;

    color: white;
    border: solid 0;
    background-color: #4aaa4a;

    cursor: pointer;
  }
}
</style>
