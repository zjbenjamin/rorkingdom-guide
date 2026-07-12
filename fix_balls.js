const fs = require('fs');
let code = fs.readFileSync('pages/catch/catch.js', 'utf8');

code = code.replace(
  "specialBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','奇趣球','补光球','国王球','棱镜球','织梦棱镜球','狂欢棱镜球','淘沙球']",
  "specialBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','绝缘球','奇趣球','补光球','国王球','棱镜球','织梦棱镜球','狂欢棱镜球','淘沙球']"
);

code = code.replace(
  "craftBalls: ['国王球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','棱镜球','淘沙球']",
  "craftBalls: ['国王球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','绝缘球','棱镜球','淘沙球']"
);

code = code.replace(
  "attributeBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','淘沙球']",
  "attributeBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','绝缘球','淘沙球']"
);

fs.writeFileSync('pages/catch/catch.js', code, 'utf8');
console.log('Fixed balls arrays');
