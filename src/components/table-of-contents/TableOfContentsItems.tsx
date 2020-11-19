import React from 'react';
import styled, { css } from 'styled-components';
// @ts-ignore
import { BulletLink } from './BulletLink';
// @ts-ignore
import { ItemLink } from './ItemLink';
// @ts-ignore
import { MenuLink } from './MenuLink';
import { color, typography } from '../shared/styles';
import { Icon } from '../Icon';
import { Link } from '../Link';

export type ItemType = 'menu' | 'link' | 'bullet-link';

export interface Item {
  title: string;
  type: ItemType;
  path?: string;
  children?: Item[];
}

export interface ItemWithId extends Item {
  id: string;
}

export interface ItemWithStateAndId extends ItemWithId {
  isOpen?: boolean;
}

const getItemComponent = (itemType: ItemType) => {
  switch (itemType) {
    case 'menu':
      return Menu;
    case 'link':
      return ItemLink;
    case 'bullet-link':
      return BulletLink;
    default:
      return null;
  }
};

const TopLevelMenuToggle = styled(Link).attrs({ isButton: true, tertiary: true })`
  font-weight: ${typography.weight.bold};
  line-height: 24px;
  word-break: break-word;
  text-align: left;

  > span {
    display: flex;

    svg {
      flex: none;
    }

    span {
      flex: 1;
    }
  }
`;

interface ArrowIconProps {
  isOpen?: boolean;
  isTopLevel?: boolean;
}

const ArrowIcon = styled(Icon).attrs({ icon: 'arrowright' })<ArrowIconProps>`
  && {
    width: 12px;
    height: 12px;
    color: ${color.mediumdark};
    transform: translateY(1px) ${(props) => props.isOpen && `rotate(90deg)`};
    ${(props) => (props.isTopLevel ? `margin-right: 8px;` : `margin-left: 8px;`)}
    bottom: -0.25em;
  }
`;

type SetMenuOpenStateById = (args: { id: string; isOpen: boolean }) => void;

interface MenuProps {
  isTopLevel?: boolean;
  item: ItemWithStateAndId;
  setMenuOpenStateById: SetMenuOpenStateById;
  currentPath: string;
}

function Menu({ isTopLevel, item, setMenuOpenStateById, currentPath, ...rest }: MenuProps) {
  if (!item.children) return null;
  const arrow = <ArrowIcon isOpen={item.isOpen} isTopLevel={isTopLevel} aria-hidden />;
  const toggleOpenState = () => setMenuOpenStateById({ id: item.id, isOpen: !item.isOpen });

  return (
    <li>
      {isTopLevel ? (
        <TopLevelMenuToggle onClick={toggleOpenState}>
          {arrow}
          <span>{item.title}</span>
        </TopLevelMenuToggle>
      ) : (
        <MenuLink isButton onClick={toggleOpenState}>
          {item.title}
          {arrow}
        </MenuLink>
      )}
      {item.isOpen && (
        <TableOfContentsItems
          items={item.children}
          isTopLevel={false}
          setMenuOpenStateById={setMenuOpenStateById}
          currentPath={currentPath}
          {...rest}
        />
      )}
    </li>
  );
}

Menu.defaultProps = {
  isTopLevel: false,
};

const List = styled.ul<{ isTopLevel?: boolean }>`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    padding-top: 12px;

    &:first-child {
      padding-top: 0;
    }
  }

  ${(props) =>
    props.isTopLevel &&
    css`
      > li {
        padding-top: 24px;

        ul,
        ol {
          padding-top: 12px;
          display: flex;
          flex-direction: column;
        }

        > ul {
          padding-left: 35px;

          > li ul {
            padding-left: 15px;
          }
        }

        > ol {
          padding-left: 20px;
        }
      }
    `}
`;

export interface TableOfContentsItemsProps {
  className?: string;
  currentPath: string;
  isTopLevel: boolean;
  items: ItemWithStateAndId[];
  setMenuOpenStateById?: SetMenuOpenStateById;
}

export function TableOfContentsItems({
  className,
  currentPath,
  isTopLevel = false,
  items,
  ...rest
}: TableOfContentsItemsProps) {
  const isOrderedList = items.every((item) => item.type === 'bullet-link');

  return (
    <List className={className} isTopLevel={isTopLevel} as={isOrderedList ? 'ol' : 'ul'}>
      {items.map((item) => {
        const ItemComponent = getItemComponent(item.type);
        return (
          <ItemComponent
            key={item.title}
            currentPath={currentPath}
            item={item}
            isTopLevel={isTopLevel}
            {...rest}
          />
        );
      })}
    </List>
  );
}

TableOfContentsItems.defaultProps = {
  className: '',
};
