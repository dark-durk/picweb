const userSql = {
  insert: 'insert into user',
  update: 'update `user` set ',
  delete: 'delete from user where ?',
  query: 'select * from `user` where ',
  queryAll: 'select * from user',
  insertImg: 'insert into image'
};
const imageSql = {
  query: 'select * from image ',
  delete: 'delete from image where ?',
  update: 'update `image` set ',
  updateCount: 'update image set click_count=click_count+1 where id=?',
  queryUnpassPic: 'select * from image where pass=0',
}
const commentSql = {
  insert: 'insert into comment',
  delete: 'delete from comment where ?',
  query: 'select `comment`.*,`user`.head_img,`user`.username from `comment` left join `user` on `comment`.uid=`user`.id where '
}

const zanSql = {
  query: 'select id,is_delete from zan where ',
  insert: 'insert into zan',
  update: 'update `zan` set ',
  count: 'select count(*) as likeCount from zan where '
}
const followSql = {
  query: 'select id,is_delete from follow where ',
  insert: 'insert into follow',
  update: 'update `follow` set ',
}
const albumSql = {
  insert: 'insert into album',
  delete: 'delete from album where ?',
  query: 'select * from `album` where ',
}
module.exports.userSql = userSql;
module.exports.imageSql = imageSql;
module.exports.commentSql = commentSql;
module.exports.zanSql = zanSql
module.exports.followSql = followSql
module.exports.albumSql = albumSql

