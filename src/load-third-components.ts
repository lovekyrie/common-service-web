import { Alert, Aside, Button, Card, Checkbox, Col, Container, DatePicker, Dialog, Dropdown, DropdownItem, DropdownMenu, Footer, Form, FormItem, Header, Icon, Input, Main, Menu, MenuItem, MenuItemGroup, Message, MessageBox, Option, Radio, RadioButton, RadioGroup, Row, Select, Submenu, Table, TableColumn, Tree } from 'element-ui'
import Vue from 'vue'

Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Footer.name, Footer)
Vue.component(Aside.name, Aside)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Card.name, Card)
Vue.component(Button.name, Button)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Dialog.name, Dialog)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Radio.name, Radio)
Vue.component(RadioButton.name, RadioButton)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Alert.name, Alert)
Vue.component(Icon.name, Icon)
Vue.component(Tree.name, Tree)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Option.name, Option)
Vue.component(Select.name, Select)

// 全局注册Message和MessageBox
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
