import React, { useState } from 'react';
import { TableOfContents, TableOfContentsProps } from './TableOfContents';
import { Item } from './TableOfContentsItems';
// @ts-ignore
import { StoryLinkWrapper } from '../StoryLinkWrapper';

export default {
  title: 'Design System/TableOfContents',
  component: TableOfContents,
  decorators: [
    (storyFn: any) => <div style={{ width: 240, outline: '1px dotted grey' }}>{storyFn()}</div>,
  ],
};

const items: Item[] = [
  {
    title: 'Get Started',
    type: 'menu',
    children: [
      {
        path: '/introduction',
        title: 'Introduction',
        type: 'bullet-link',
      },
      {
        path: '/setup',
        title: 'Setup',
        type: 'bullet-link',
      },
      {
        path: '/write-a-story',
        title: 'Write a story',
        type: 'bullet-link',
      },
    ],
  },
  {
    title: '😀 Customize',
    type: 'menu',
    children: [
      {
        title: 'User interface',
        type: 'menu',
        children: [
          {
            path: '/features-and-behavior',
            title: 'features and behavior dolor sit amet consectatur',
            type: 'link',
          },
          {
            path: '/theming',
            title: 'Theming',
            type: 'link',
          },
        ],
      },
      {
        title: 'Head tags',
        type: 'link',
        path: '/head-tags',
      },
      {
        title: 'Body tags',
        type: 'link',
        path: '/body-tags',
      },
    ],
  },
  {
    title: '⚙️ Super long root heading that is very long',
    type: 'menu',
    children: [
      {
        title: 'Verbose menu link that is extremely lengthy',
        type: 'menu',
        children: [
          {
            path: '/lorem-ipsum',
            title: 'Lorem ipsum dolor sit amet consectatur',
            type: 'link',
          },
          {
            path: '/theming',
            title: 'Theming',
            type: 'link',
          },
        ],
      },
      {
        title: 'Head tags',
        type: 'link',
        path: '/head-tags',
      },
      {
        title: 'Body tags',
        type: 'link',
        path: '/body-tags',
      },
    ],
  },
];

const findPaths = (pathItems: Item[]) =>
  // @ts-ignore
  pathItems.flatMap((item: Item) => item.path || findPaths(item.children));
const paths = findPaths(items);

export const BasicFlat = (args: TableOfContentsProps) => <TableOfContents {...args} />;
BasicFlat.args = {
  currentPath: '/essentials',
  items: [
    {
      title: '⭐️  Popular',
      path: '/popular',
      type: 'link',
    },
    {
      title: '🧩  Essentials',
      path: '/essentials',
      type: 'link',
    },
    {
      title: '🛠  Code',
      path: '/code',
      type: 'link',
    },
    {
      title: '⚡️  Data & state',
      path: '/Data & state',
      type: 'link',
    },
    {
      title: '💅  Style',
      path: '/style',
      type: 'link',
    },
    {
      title: '🎨  Design',
      path: '/design',
      type: 'link',
    },
    {
      title: '⚙️  Appearance',
      path: '/appearance',
      type: 'link',
    },
    {
      title: '🗄  Organize',
      path: '/organize',
      type: 'link',
    },
  ],
};

export const BasicNested = (args: TableOfContentsProps) => <TableOfContents {...args} />;
BasicNested.args = { currentPath: paths[0], items };

export const NestedActivePath = BasicNested.bind({});
NestedActivePath.args = { currentPath: '/features-and-behavior', items };

const addLinkWrappers = (itemsToCompose: Item[]): Item[] =>
  itemsToCompose.map((item: Item) => {
    if (item.type === 'link' || item.type === 'bullet-link')
      return { ...item, LinkWrapper: StoryLinkWrapper };
    if (item.children) return { ...item, children: addLinkWrappers(item.children) };
    return item;
  });
const itemsWithLinkWrappers = addLinkWrappers(items);
export const LinkWrappers = BasicNested.bind({});
LinkWrappers.args = { currentPath: paths[0], items: itemsWithLinkWrappers };

export const WithOpenControls = () => (
  <TableOfContents currentPath={paths[0]} items={items}>
    {({ menu, toggleAllOpen, toggleAllClosed }) => (
      <>
        <div style={{ marginBottom: '10px' }}>
          {/* eslint-disable-next-line react/button-has-type */}
          <button onClick={toggleAllOpen}>Open all</button>
          {/* eslint-disable-next-line react/button-has-type */}
          <button onClick={toggleAllClosed}>Close all</button>
        </div>

        {menu}
      </>
    )}
  </TableOfContents>
);

export const WithPathSwitcher = () => {
  const [currentPath, setCurrentPath] = useState(paths[0]);
  const cyclePath = () => {
    const currentIndex = paths.indexOf(currentPath);
    setCurrentPath(paths[currentIndex + 1] || paths[0]);
  };

  return (
    <>
      {/* eslint-disable-next-line react/button-has-type */}
      <button style={{ marginBottom: '10px' }} onClick={cyclePath}>
        Change path
      </button>
      <TableOfContents currentPath={currentPath} items={items} />
    </>
  );
};
