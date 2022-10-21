declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import ƒAid = FudgeAid;
    function setupSprite(_name: string, _position: number[], _frames: number, _offset: number): Promise<ƒAid.NodeSprite>;
}
