function chaToEnAboutCircle(circle) {
  switch (circle) {
    case "工作人事": return "work";
      break;
    case "课业培训": return "training";
      break;
    case "健身休闲": return "play";
      break;
    case "家庭分享": return "share";
      break;
    case "光影": return "photo";
      break;
    default: return "工作人事";
  }
}
module.exports = {
  chaToEnAboutCircle
}