import React, { useState } from 'react';
import styled from 'styled-components';
import { MenuLink } from './MenuLink';

export default {
  title: 'TableOfContents/MenuLink',
  component: MenuLink,
  parameters: { chromatic: { disable: true } },
};

export const Base = () => <MenuLink>Menu link</MenuLink>;
