abstract class Communication {
  abstract send(): void;
  abstract receive(): void;
}
class POP {}
class Content implements Communication {
  send(): void {}
  receive(): void {}
}
class Background {}
