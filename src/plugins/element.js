import Vue from 'vue'
import {
  Button,
  Row,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'

Vue
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Row)
Vue.prototype.$message = Message
