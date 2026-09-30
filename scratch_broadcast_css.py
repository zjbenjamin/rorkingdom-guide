from pathlib import Path

p = Path(r"F:\rorkingdom-guide\pages\index\index.wxss")
t = p.read_text(encoding="utf-8")
start = t.find("/* ROCOKINGDOM广播站 */")
if start < 0:
    raise SystemExit("start not found")
# end after .broadcast-arrow block
end = t.find(".broadcast-arrow")
end = t.find("}", t.find("{", end))
end = t.find("\n", end) + 1
print("start", start, "end", end)

new = """/* ROCOKINGDOM广播站 */
.broadcast-section {
  margin-top: 28rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #21262d;
}
.broadcast-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 14rpx;
}
.broadcast-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  background: linear-gradient(180deg, rgba(13, 17, 23, 0.95), rgba(13, 17, 23, 0.8));
  border: 1rpx solid #21262d;
  border-radius: 16rpx;
  padding: 18rpx 16rpx;
}
.broadcast-item:active { opacity: 0.88; }
.broadcast-badge {
  flex-shrink: 0;
  font-size: 20rpx;
  font-weight: 700;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  margin-top: 2rpx;
}
.broadcast-badge.swarm {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  border: 1rpx solid rgba(0, 212, 255, 0.18);
}
.broadcast-badge.merchant {
  background: rgba(255, 171, 64, 0.1);
  color: #ffab40;
  border: 1rpx solid rgba(255, 171, 64, 0.18);
}
.broadcast-body { flex: 1; min-width: 0; }
.broadcast-head {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
}
.broadcast-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #e6edf3;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.broadcast-tag {
  flex-shrink: 0;
  font-size: 20rpx;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.08);
  border: 1rpx solid rgba(0, 212, 255, 0.16);
  border-radius: 999rpx;
  padding: 2rpx 12rpx;
}
.broadcast-desc {
  display: block;
  font-size: 22rpx;
  color: rgba(230, 237, 243, 0.65);
  line-height: 1.5;
  word-break: break-word;
}
.broadcast-items {
  margin-top: 4rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.broadcast-goods {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 12rpx 14rpx;
  background: rgba(255, 255, 255, 0.03);
  border: 1rpx solid rgba(255, 255, 255, 0.05);
  border-radius: 10rpx;
}
.goods-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.goods-name {
  font-size: 24rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-meta {
  font-size: 18rpx;
  color: rgba(255, 171, 64, 0.8);
}
.goods-price {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
  font-weight: 800;
  color: #ffab40;
  font-family: 'DIN Alternate', monospace;
}
.roco-icon {
  width: 24rpx;
  height: 24rpx;
}
.broadcast-countdown {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #ffd54f;
}
.broadcast-time {
  display: block;
  margin-top: 6rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.3);
}
.broadcast-arrow {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.2);
  font-size: 22rpx;
  margin-top: 6rpx;
}
"""

t = t[:start] + new + t[end:]
p.write_text(t, encoding="utf-8")
print("ok")
