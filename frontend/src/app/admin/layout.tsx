"use client";

import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Backdrop,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Collapse
} from "@mui/material";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import MuiDrawer from "@mui/material/Drawer";
import { usePathname, useRouter } from "next/navigation";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import HomeIcon from "@mui/icons-material/Home";
import { 
  AccountCircle, 
  School as SchoolIcon, 
  Dashboard as DashboardIcon, 
  BarChart as BarChartIcon, 
  ReportProblem,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import useLogout from "@/hooks/useLogout";
import Image from 'next/image';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

// Drawer
const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

const defaultTheme = createTheme();

interface AccordionMenuItemProps {
  icon: React.ReactElement;
  text: string;
  subItems: { text: string; path: string }[];
  open: boolean;
  onToggle: () => void;
  onSubItemClick: (path: string) => void;
}

const AccordionMenuItem: React.FC<AccordionMenuItemProps> = ({ 
  icon, text, subItems, open, onToggle, onSubItemClick 
}) => {
  return (
    <>
      <ListItemButton onClick={onToggle}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((item, index) => (
            <ListItemButton 
              key={index} 
              sx={{ pl: 4 }}
              onClick={() => onSubItemClick(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [openMenus, setOpenMenus] = useState({
    lesson: false,
    quiz: false,
    stats: false,
    claim: false,
  });
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const hideHeader = pathname === "/admin/auth";
  const birdId = getCookie('birdId');

  useEffect(() => {
    const birdId = getCookie('birdId');
    if (birdId) {
      setProfileImageUrl(`/mini_profile/${birdId}.png`);
    }
    
    setIsLoading(true)
    switch (true) {
      case getCookie("role") !== "ADMIN":
        router.push("/");
        break;
      case sessionStorage?.getItem("adminToken") !== process.env.NEXT_PUBLIC_ADMIN_TOKEN:
        router.push("/admin/auth");
        break;
      default:
        setIsLoading(false);
    }
  }, [router]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleImageError = () => {
    setProfileImageUrl('/path-to-default-avatar.png');
  };

  const toggleMenu = (menu: 'lesson' | 'quiz' | 'stats' | 'claim') => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleSubItemClick = (path: string) => {
    router.push(path);
  };

  if (isLoading && !hideHeader) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {!hideHeader && (
          <>
            <AppBar position="fixed">
              <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    관리자 페이지
                  </Typography>
                </Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar 
                    alt="User Avatar" 
                    src={profileImageUrl} 
                    onError={handleImageError}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent">
              <Toolbar />
              <Box sx={{ overflow: 'auto' }}>
                <List>
                  <ListItemButton onClick={() => router.push("/admin")}>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="메인" />
                  </ListItemButton>
                  <AccordionMenuItem
                    icon={<SchoolIcon />}
                    text="레슨"
                    subItems={[
                      { text: "조회 및 수정", path: "/admin/lesson/view" },
                      { text: "생성", path: "/admin/lesson/create" }
                    ]}
                    open={openMenus.lesson}
                    onToggle={() => toggleMenu('lesson')}
                    onSubItemClick={handleSubItemClick}
                  />
                  <AccordionMenuItem
                    icon={<DashboardIcon />}
                    text="퀴즈"
                    subItems={[
                      { text: "조회 및 수정", path: "/admin/quiz/view" },
                      { text: "생성", path: "/admin/quiz/create" }
                    ]}
                    open={openMenus.quiz}
                    onToggle={() => toggleMenu('quiz')}
                    onSubItemClick={handleSubItemClick}
                  />
                  <AccordionMenuItem
                    icon={<ReportProblem />}
                    text="신고"
                    subItems={[
                      { text: "레슨 신고 내용", path: "/admin/claim/lesson" },
                      { text: "채팅 신고 내용", path: "/admin/claim/user" }
                    ]}
                    open={openMenus.claim}
                    onToggle={() => toggleMenu('claim')}
                    onSubItemClick={handleSubItemClick}
                  />
                  <AccordionMenuItem
                    icon={<BarChartIcon />}
                    text="통계"
                    subItems={[
                      { text: "사용자 지역별 현황", path: "/admin/statistics/userlocation" },
                      { text: "사용자 컨텐츠 통계", path: "/admin/statistics/usercontents" },
                      { text: "사용자 유사도/정확도 통계", path: "/admin/statistics/usersimilarity" },
                      { text: "사용자 레슨 통계", path: "/admin/statistics/userlesson" }
                    ]}
                    open={openMenus.stats}
                    onToggle={() => toggleMenu('stats')}
                    onSubItemClick={handleSubItemClick}
                  />
                </List>
              </Box>
            </Drawer>
          </>
        )}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}