# Discord 사다리 타기 & 투표 봇

이 프로젝트는 Discord 서버를 위한 다기능 봇으로, 사다리 타기 게임과 투표 시스템을 제공합니다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/027bf661-0567-4a3a-908a-151c8d7985fb" alt="Discord Bot Example" />
</div>

## 주요 기능

1. 사다리 타기
   - `/사다리 타기` 명령어를 사용하여 참가자들 사이에서 무작위로 순위를 정합니다.
   - 최소 2명 이상의 참가자가 필요합니다.

2. 투표 시스템
   - `/투표` 명령어로 새로운 투표를 시작할 수 있습니다.
   - 최대 10개의 선택지를 제공할 수 있습니다.
   - 사용자들은 이모지 반응으로 투표에 참여합니다.
   - `/투표종료` 명령어로 진행 중인 투표를 마감하고 결과를 확인할 수 있습니다.

## TOKEN과 CLIENT_ID

### TOKEN:
- Discord 봇의 인증 토큰을 의미합니다.
- 이는 봇이 Discord API와 통신할 때 자신을 인증하는 데 사용되는 비밀 키입니다.
- Discord Developer Portal(https://discord.com/developers/applications)에서 봇을 생성한 후 얻을 수 있습니다.
- 애플리케이션 페이지의 "Bot" 섹션에서 "Token" 항목을 확인하거나 재생성할 수 있습니다.
- 이 토큰은 절대 공개되어서는 안 되며, 안전하게 보관해야 합니다.

### CLIENT_ID:
- Discord 애플리케이션의 고유 식별자입니다.
- Discord Developer Portal의 애플리케이션 페이지에서 "General Information" 섹션의 "Application ID"에서 찾을 수 있습니다.
- 이 ID는 봇을 서버에 초대하거나 API 요청을 할 때 사용됩니다.

## 사용 방법

봇을 Discord 서버에 초대한 후, 슬래시 명령어를 사용하여 각 기능을 이용할 수 있습니다.

- `/사다리 타기`: 사다리 타기 게임을 시작합니다.
- `/투표`: 새로운 투표를 생성합니다.
- `/투표종료`: 진행 중인 투표를 종료하고 결과를 확인합니다.
