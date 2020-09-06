// 连接数据库的js文件
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/stu',{useNewUrlParser: true,useUnifiedTopology: true})

const conn=mongoose.connection

conn.on('connected',()=>{
    console.log('数据库连接成功。。。')
})

const userSchema=mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String ,required:true}
})
const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    price:{type:String ,required:true},
	count:{type:Number ,required:true},
})
const UserModel=mongoose.model('user',userSchema)
const ProductModel=mongoose.model('product',productSchema)

exports.UserModel=UserModel;
exports.ProductModel=ProductModel;