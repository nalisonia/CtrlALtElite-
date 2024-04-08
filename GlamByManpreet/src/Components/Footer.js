import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <Box component="footer" sx={{ bgcolor: 'white', color: 'black', p: 3, position: 'fixed', bottom: 0, width: '100%' }}>
        {/* Black banner */}
        <Box sx={{ backgroundColor: 'black', height: '1vh' }} />

        {/* Spacing between banner and text */}
        <Box sx={{ height: '2vh' }} /> {/* You can adjust the value as needed */}

        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
                © {new Date().getFullYear()} GlamByManpreet. All rights reserved.
              </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" sx={{ color: 'inherit', mr: 3, mb: 1.5 }}>
                  Terms of Service
                </Link>
                <Link href="/about" sx={{ color: 'inherit', mr: 3, mb: 1.5 }}>
                  Privacy Policy
                </Link>
                <Link href="/contact" sx={{ color: 'inherit', mr: 3, mb: 1.5 }}>
                  Copyright Policy
                </Link>
                <Link href="/privacy" sx={{ color: 'inherit', mr: 3, mb: 1.5 }}>
                  Cookie Policy
                </Link>
                <Link href="/privacy" sx={{ color: 'inherit', mr: 3, mb: 1.5 }}>
                  Do not sell or share my personal information
                </Link>
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  aria-label="Instagram"
                  component="a"
                  href="https://www.instagram.com/glambymanpreet/"
                  size="large"
                  sx={{ ml: 2 }}
                >
                  <InstagramIcon sx={{ color: 'common.black' }} />
                </IconButton>
                <IconButton
                  aria-label="TikTok"
                  component="a"
                  href="https://www.tiktok.com/@glambymanpreet"
                  size="large"
                  sx={{ ml: 2 }}
                >
                  <FaTiktok size={24} color="black" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;