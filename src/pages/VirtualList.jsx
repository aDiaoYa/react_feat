import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getList } from "../api/list";
import "./VirtualList.css";

const VirtualList = () => {
  const oneHeight = 100;
  const screenHeight = window.innerHeight;
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([]);

  const [scrollTop, setScrollTop] = useState(0);
  const newsBoxStyle = {
    height: screenHeight,
  };
  const virtualListStyle = {
    height: list.length * oneHeight,
  };
  const [loading, setLoading] = useState(true);
  const [containSize, setContainSize] = useState(
    Math.ceil(screenHeight / oneHeight)
  );
  const getListData = async () => {
    try {
      setMsg("数据正在疯狂加载中，请小主耐心等候...");
      const res = await getList(10000);
      let lists = [...res.list];
      setList(lists);
    } catch (err) {
      console.log("Error fetching list:", err);
      setMsg("小主，您的数据加载失败惹，请刷新重试！");
    } finally {
      setLoading(false);
    }
  };
  const getContainerSize = () => {
    setContainSize(Math.ceil(screenHeight / oneHeight));
  };
  const handleScroll = (e) => {
    let scrollTop = e.target.scrollTop;
    setScrollTop(scrollTop);
  };
  useEffect(() => {
    getListData();
    getContainerSize();
    window.addEventListener("resize", getContainerSize);
    window.addEventListener("orientationchange", getContainerSize);
    return () => {
      window.removeEventListener("resize", getContainerSize);
      window.removeEventListener("orientationchange", getContainerSize);
    };
  }, []);
  const ItemRender = () => {
    let item = [];
    const startIndex = Math.floor(scrollTop / oneHeight);
    let bufferStartIndex = Math.max(0, startIndex - 2);
    let bufferEndIndex = Math.min(list.length, startIndex + containSize + 2);
    for (let i = bufferStartIndex; i < bufferEndIndex; i++) {
      const itemStyle = {
        top: 100 * i,
      };
      item.push(
        <li className="virtual_item" style={itemStyle} key={list[i].id}>
          <div className="item_left">
            <h3>{list[i].title}</h3>
            <div className="left_bottom">
              <p>
                <img src={require("../image/message.png")} alt="留言" />
                <span>{list[i].reads}</span>
                <span>{list[i].from}</span>
              </p>
              <span>{list[i].date}</span>
            </div>
          </div>
          <div className="item_right">
            <img
              src={list[i].image}
              alt={list[i].title}
              title={list[i].title}
            />
          </div>
        </li>
      );
    }
    return item;
  };
  return (
    <div className="news-box" style={newsBoxStyle} onScroll={handleScroll}>
      {loading ? (
        <div>{msg}</div>
      ) : (
        <ul className="virtual_list" style={virtualListStyle}>
          {ItemRender()}
        </ul>
      )}
    </div>
  );
};

export default VirtualList;
