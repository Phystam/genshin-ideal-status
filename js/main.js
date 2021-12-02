
class Character {
    //変数宣言
    constructor() {
	
	this.BaseATK = 1;
	
    }

    var BaseATK;
    var BaseHP;
    var BaseDEF;
    var ATK;
    var DEF;
    var HP;
    var ATKconst;
    var DEFconst;
    var HPconst;
    var TotalATK;
    var TotalDEF;
    var TotalHP;
    
    var ER;
    var EM;
    
    var BaseDMG;
    
    var DMG = new Array(5);//通常,重撃,落下,スキル,爆発
    for(let i=0;i<5;i++){
	DMG[i] = new Array(8).fill(0);
    }
    var BaseCritRate;
    var BaseCritDMG;
    var CritRate = new Array(5);//通常,重撃,落下,スキル,爆発
    for(let i=0;i<5;i++){
	CritRate[i] = new Array(8).fill(0);
    }
    var CritDMG = new Array(5);//通常,重撃,落下,スキル,爆発
    for(let i=0;i<5;i++){
	CritDMG[i] = new Array(8).fill(0);
    }
    
    //CritDMG[0][0]→通常物理の会心ダメージ
    //CritDMG[0][1]→通常炎の会心ダメージ
    //1番目の引数→通常/重撃/落下/スキル/爆発
    //2番目の引数→物理/炎/水/雷/氷/風/岩/草
    var NormalTalentATK = new Array(6);
    for(let i=0;i<5;i++){
	NormalTalentATK[i] = new Array(11).fill(0);
    }
    var NormalTalentDEF = new Array(6);
    for(let i=0;i<5;i++){
	NormalTalentDEF[i] = new Array(11).fill(0);
    }
    var NormalTalentHP = new Array(6);
    for(let i=0;i<5;i++){
	NormalTalentHP[i] = new Array(11).fill(0);
    }
    
    var NormalTalentLv;
    var SkillLv;
}


TotalATK=BaseATK*(1+ATK)+ATKconst;
TotalDEF=BaseDEF*(1+DEF)+DEFconst;
TotalHP=BaseHP*(1+HP)+HPconst;

BaseDMG=NormalTalentATK[0][NormalTalentLv]*TotalATK
    + NormalTalentDEF[0][0]*TotalDEF
    + NormalTalentHP[0][NormalTalentLv]*TotalHP;

alert( "Hello~");

