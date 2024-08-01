import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReportProblem from "@mui/icons-material/ReportProblem";
import SchoolIcon from "@mui/icons-material/School";
import { useRouter } from "next/navigation";
import { CustomAccordionItemProps } from "@/utils/props";

// Accordion Item Component with Custom Icon
function AccordionItem({
  primaryText,
  items,
  icon,
  paths,
  basePath,
}: CustomAccordionItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleItemClick = (path: string) => {
    router.push(`${basePath}/${path}`);
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handleClick} sx={{ pl: 2, pr: 2 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primaryText} />
        {open ? (
          <ListItemIcon sx={{ minWidth: 30 }}>
            <ExpandLessIcon />
          </ListItemIcon>
        ) : (
          <ListItemIcon sx={{ minWidth: 30 }}>
            <ExpandMoreIcon />
          </ListItemIcon>
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{ pl: 4 }}
            onClick={() => handleItemClick(paths[index])}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </Collapse>
    </React.Fragment>
  );
}

// Secondary List Items with Accordion and Custom Icons
export const secondaryListItems = (
  <>
    <ListSubheader component="div" inset>
      집에 가고 싶다
    </ListSubheader>
    <AccordionItem
      primaryText="회원 관리"
      items={["조회", "생성", "수정", "삭제"]}
      icon={<PeopleIcon />}
      basePath="/admin/user"
      paths={["view", "create", "edit", "delete"]} // Paths for each item
    />
    <AccordionItem
      primaryText="레슨"
      items={["조회", "생성", "수정", "삭제"]}
      icon={<SchoolIcon />}
      basePath="/admin/lesson"
      paths={["view", "create", "edit", "delete"]} // Paths for each item
    />
    <AccordionItem
      primaryText="퀴즈 관리"
      items={["조회", "생성", "수정", "삭제"]}
      icon={<DashboardIcon />}
      basePath="/admin/quiz"
      paths={["view", "create", "edit", "delete"]} // Paths for each item
    />
    <AccordionItem
      primaryText="신고 관리"
      items={["조회", "생성", "수정", "삭제"]}
      icon={<ReportProblem />}
      basePath="/admin/report"
      paths={["view", "create", "edit", "delete"]} // Paths for each item
    />
    <AccordionItem
      primaryText="통계"
      items={["조회", "생성", "수정", "삭제"]}
      icon={<BarChartIcon />}
      basePath="/admin/stats"
      paths={["view", "create", "edit", "delete"]} // Paths for each item
    />
  </>
);
