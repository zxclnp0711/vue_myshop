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
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'

Vue
  .use(Button)
  .use(Dialog)
  .use(Option)
  .use(Select)
  .use(Tree)
  .use(Tag)
  .use(Tooltip)
  .use(Pagination)
  .use(Card)
  .use(Switch)
  .use(Table)
  .use(TableColumn)
  .use(Col)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
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
Vue.prototype.$confirm = MessageBox.confirm
