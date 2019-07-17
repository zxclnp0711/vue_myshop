import Vue from 'vue'
import {
  Button,
  Row,
  Form,
  FormItem,
  Input,
  Message,
  Header,
  Container,
  Main,
  Aside,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'

Vue
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Row)
  .use(Header)
  .use(Container)
  .use(Main)
  .use(Aside)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
Vue.prototype.$message = Message
