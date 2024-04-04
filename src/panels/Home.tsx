import { FC } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Avatar,
  NavIdProps,
  Input,
  IconButton,
  FormItem,
  FormStatus,
  FormLayoutGroup,
} from '@vkontakte/vkui';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import React from 'react';
import { Icon16Clear } from '@vkontakte/icons';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const textInput = React.useRef<HTMLInputElement>(null);
  const errorMessage = React.useRef<HTMLDivElement>(null);

  const handleInputChange = () => {
    if (errorMessage.current?.hidden == false) {
      errorMessage.current.hidden = true;
    }
  };

  const handleButtonClick = () => {
    bridge.send('VKWebAppShowImages', getImageUrl())
      .catch((error) => {
        console.log(error);
        if (errorMessage.current) {
          errorMessage.current.hidden = false;
        }
      });
  }

  const getImageUrl = () => {
    if (textInput.current) {
      textInput.current.focus();
      return {
        'images' : [textInput.current.value],
      };
    }
  };

  const clear = () => {
    if (textInput.current) {
      textInput.current.value = '';
      textInput.current.focus();
      if (errorMessage.current) {
          errorMessage.current.hidden = true;
      }
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Open Image</Header>}>
        <Div hidden={true} getRootRef={errorMessage}>
          <FormStatus header="Это не ссылка" mode="error">
            Необходимо ввести ссылку на картинку
          </FormStatus>
        </Div>

        <FormLayoutGroup>
          <FormItem htmlFor="link" top="Ссылка на картинку">
            <Input 
              id = "link"
              getRef={textInput} 
              type="text"
              after={
                <IconButton hoverMode="opacity" label="Очистить поле" onClick={clear}>
                  <Icon16Clear />
                </IconButton>
              }
              onChange={handleInputChange}
            />
          </FormItem>
          <FormItem>
            <Button stretched size="l" mode="secondary" onClick={handleButtonClick}>
              Открыть картинку
            </Button>
          </FormItem>
        </FormLayoutGroup>
      </Group>
    </Panel>
  );
};
