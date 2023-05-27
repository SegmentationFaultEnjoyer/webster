<template>
  <div class="app-background">
    <div class="app-background__wave" />
    <div class="app-background__wave" />
  </div>
</template>

<style lang="scss" scoped>
.app-background {
  color: var(--tertiary-main);
  width: 100vw;
  height: toRem(300);
  position: relative;
  overflow: hidden;
}

.app-background__wave {
  background: url('/assets/wave.svg') repeat-x;
  position: absolute;
  bottom: 0;
  width: toRem(6400);
  height: toRem(198);
  animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);

  &:last-of-type {
    bottom: toRem(-60);
    animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
      swell 7s ease -1.25s infinite;
    opacity: 1;
  }
}

@keyframes wave {
  0% {
    margin-left: 0;
  }

  100% {
    margin-left: toRem(-1600);
  }
}

@keyframes swell {
  0%,
  100% {
    transform: translate3d(0, toRem(-25), 0);
  }

  50% {
    transform: translate3d(0, toRem(5), 0);
  }
}
</style>
