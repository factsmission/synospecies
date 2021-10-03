<template>
  <div
    class="rot"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
.rot {
  display: inline-block;
  margin: 0.4rem 0.4rem 0;
  border-radius: 50%;
  animation-name: rot;
  animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  animation-iteration-count: infinite;
  animation-duration: 4.8s;
  width: 1rem;
  height: 1rem;
  background-color: #81951d;
  transform-style: preserve-3d;
}

.rot:after {
  content: '';
  right: 0px;
  bottom: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 50%;
  background: #9bc134;
  transform: rotateY( 180deg );
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

@keyframes rot {
  0%,
  100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}
</style>
