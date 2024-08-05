import { useState } from "react";
import { useRouter } from "next/navigation";
import Collapse from "@mui/material/Collapse";
import SchoolIcon from "@mui/icons-material/School";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListSubheader from "@mui/material/ListSubheader";
import { CustomAccordionItemProps } from "@/utils/props";
import ListItemButton from "@mui/material/ListItemButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReportProblem from "@mui/icons-material/ReportProblem";
import HomeIcon from "@mui/icons-material/Home"

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

  function handleClick() {
    setOpen(!open);
  };

  function handleItemClick(path: string) {
    router.push(`${basePath}/${path}`);
  };

  return (
    <>
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
    </>
  );
}

export default (
  <>
    <ListSubheader component="div" inset>
      목록
    </ListSubheader>

    <AccordionItem
      primaryText="레슨"
      items={["조회 및 수정", "생성"]}
      icon={<SchoolIcon />}
      basePath="/admin/lesson"
      paths={["view", "create"]} // Paths for each item
    />
    <AccordionItem
      primaryText="퀴즈"
      items={["조회 및 수정", "생성"]}
      icon={<DashboardIcon />}
      basePath="/admin/quiz"
      paths={["view", "create"]} // Paths for each item
    />
    <AccordionItem
      primaryText="신고"
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
