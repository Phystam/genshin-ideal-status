const Charlist=['amber','albedo'];
const Statlist=['ATK','ATKconst','DEF','DEFconst','HP','HPconst', 'EM', 'ER', 'HealBonus',
		'PhysDMG', 'PyroDMG', 'HydroDMG', 'ElectroDMG', 'CryoDMG', 'AnemoDMG', 'GeoDMG','DendroDMG', 'CritRate', 'CritDMG'];
const Attacklist=['Normal', 'Charged', 'Plunge', 'Skill', 'Burst'];
const Elementlist=['PhysDMG', 'PyroDMG', 'HydroDMG', 'ElectroDMG', 'CryoDMG', 'AnemoDMG', 'GeoDMG','DendroDMG'];

var Weaponstat;
var Characters = new Array();
var Weapons = new Array();
var ArtifactSets = new Array();
var Artifactstat;
//現在選択中のキャラや武器など
var Character;
var Weapon;
var Artifact=new Array();
Artifact[0]=new Object();
Artifact[1]=new Object();
Artifact[2]=new Object();
Artifact[3]=new Object();
Artifact[4]=new Object();
Artifact[3].HPconst=4780;
Artifact[4].ATKconst=311;

var ArtifactSet;

var CharIndex;
var WeaponIndex;

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

var AddDMG = new Object();//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    AddDMG[Attacklist[i]] = new Object();
    for(let j=0; j<8;j++){
	AddDMG[Attacklist[i]][Elementlist[j]] = 0;
    }
}
var CritRate;
var CritDMG;
var AddCritRate = new Object();//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    AddCritRate[Attacklist[i]] = new Object();
    for(let j=0; j<8;j++){
	AddCritRate[Attacklist[i]][Elementlist[j]] = 0;
    }
}
var AddCritDMG = new Object();//通常,重撃,落下,スキル,爆発
for(let i=0;i<5;i++){
    AddCritRate[Attacklist[i]] = new Object();
    for(let j=0; j<8;j++){
	AddCritRate[Attacklist[i]][Elementlist[j]] = 0;
    }
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



window.onload = async function(){
    await init();
    addCharOption();
    updateCharacter();
    updateWeaponOption();
    updateWeapon();
    for(let i=0;i<3;i++){
	updateArtifact(i);
    }
}


async function init() {
    //キャラクターデータ読み込み
    var response;
    for(let i in Charlist){
	response = await fetch('database/character/'+Charlist[i]+'.json');
	const json = await response.json();
	Characters.push(json);
    }
//    console.log(Characters[0].Name);
    //武器データ読み込み
    response = await fetch('database/weapon/weapons.json');
    Weapons = await response.json();
    //武器ステータス読み込み
    response = await fetch('database/weapon/stats.json');
    Weaponstat = await response.json();

    //聖遺物データ読み込み
    response = await fetch('database/artifact/artifactstat.json');
    Artifactstat = await response.json();

}


function addCharOption(){
    const charselect = document.getElementById("charlist");

    for(let i in Charlist){
    	const option = document.createElement('option');
    	option.text = Characters[i].Name;
    	option.value = i;
    	console.log(Characters[i].Name);
    	charselect.appendChild(option);
    }
}

function updateWeaponOption(){
    const weaponselect = document.getElementById("weaponlist");
    Reset(weaponselect);

    const charselect = document.getElementById("charlist");
    const weapontype = Characters[charselect.value].Weapon;
    for(let i in Weapons){
	if( Weapons[i].Type == weapontype ){
    	    const option = document.createElement('option');
    	    option.text = Weapons[i].Name;
    	    option.value = Weapons[i].ID;
    	    console.log(Weapons[i].Name);
    	    weaponselect.appendChild(option);
	    WeaponIndex=i;
	}
    }
}

function updateCharacter(){
    const charselect = document.getElementById("charlist");
    const levelselect = document.getElementById("charlevel");
    const level = Number(levelselect.value);
    Character = Characters[charselect.value];
    Character.Level=level;

    const passive1text = document.getElementById("passive1text");
    const passive2text = document.getElementById("passive2text");
    passive1text.innerText = Character.PassiveTalent1.Condition;
    passive2text.innerText = Character.PassiveTalent2.Condition;
    const passive1check = document.getElementById("passive1check");
    const passive2check = document.getElementById("passive2check");
    passive1check.disabled = Character.PassiveTalent1.Fixed;
    passive2check.disabled = Character.PassiveTalent2.Fixed;

    passive1check.checked = Character.PassiveTalent1.Check;
    passive2check.checked = Character.PassiveTalent2.Check;
    
    console.log("updateCharacter:"+Character.Name+" level="+Character.Level);
//    updateStatus();
}

function updateWeapon(){
    const weaponselect = document.getElementById("weaponlist");
    const charselect = document.getElementById("charlist");
    const weaponlevelselect = document.getElementById("weaponlevel");
    const level = Number(weaponlevelselect.value);
    console.log(level);
    const weapontype = Character.Weapon;
    Weapon = Weapons[WeaponIndex];
    const BaseATKType = Weapon.BaseATKType;
    const stat = Weapon.Stat;
    for(let i in Statlist){
	Weapon[Statlist[i]]=0;
    }
    const Rarity = Weapon.Rarity;
    
    for( let i in Weaponstat ){
	if(BaseATKType == Weaponstat[i].BaseATKType
	   && Rarity == Weaponstat[i].Rarity){
	    BaseATK=Weaponstat[i].BaseATK[level];
	    Weapon.BaseATK=BaseATK;
	    Weapon[stat]=Weaponstat[i][stat][level];
	    console.log(Weapon.BaseATK+" stat:"+Weapon[stat]);
	}
    }
    updateStatus();
}

function updateArtifact(i){
    let position;
    switch(i){
    case 0:
	position = "sand";
	break;
    case 1:
	position = "goblet";
	break;
    case 2:
	position = "circlet";
	break;
    default:
	position = "sand";
    }
    const artifactselect = document.getElementById(position);
    const keys = Object.keys(Artifactstat);
    for(let j in keys ) {
	if(keys[j]==artifactselect.value){
	    Artifact[i][keys[j]] = Artifactstat[artifactselect.value];
	    console.log( "KEY:" + artifactselect.value + "Value:" + Artifact[i][keys[j]] );
	}else{
	    Artifact[i][keys[j]]=0;
	}
    }
    updateStatus();
}

function calcDamage(){
    BaseATK=Character.BaseATK[Character.Level] + Weapon.BaseATK;
    ATK=Character.ATK[Character.Level]+Weapon.ATK+Artifact[0].ATK+Artifact[1].ATK+Artifact[2].ATK;
    DEF=Character.DEF[Character.Level]+Weapon.DEF+Artifact[0].DEF+Artifact[1].DEF+Artifact[2].DEF;
    HP=Character.HP[Character.Level]+Weapon.HP+Artifact[0].HP+Artifact[1].HP+Artifact[2].HP;
    EM=Character.EM[Character.Level]+Weapon.EM+Artifact[0].EM+Artifact[1].EM+Artifact[2].EM;
    ER=Character.ER[Character.Level]+Weapon.ER+Artifact[0].ER+Artifact[1].ER+Artifact[2].ER;
    HealBonus=Character.HealBonus[Character.Level]+Artifact[2].HealBonus;
    HPconst=4780;
    ATKconst=311;

    for(let i=0;i<5;i++){
	for(let j=0; j<8;j++){
	    AddDMG[Attacklist[i]][Elementlist[j]] = 0;
	}
    }
    for(let i in Elementlist){
	AddDMGData(Elementlist[i],Character[Elementlist[i]][Character.Level]);
	AddDMGData(Elementlist[i],Weapon[Elementlist[i]]);
	AddDMGData(Elementlist[i],Artifact[1][Elementlist[i]]);
    }

    //会心
    CritRate=Character.CritRate[Character.Level]+Weapon.CritRate+Artifact[2].CritRate;
    CritDMG=Character.CritDMG[Character.Level]+Weapon.CritDMG+Artifact[2].CritDMG;

    //固有天賦------------
//    Character.PassiveTalent1.Effect.DMG


    var Crit=1+CritRate*CritDMG;
    TotalATK=BaseATK*(1+ATK)+ATKconst;
    TotalDEF=BaseDEF*(1+DEF);
    TotalHP=BaseHP*(1+HP)+HPconst;

    ATKDMG=TotalATK*1.00;
    

    console.log(TotalATK*Crit*(1+AddDMG.Skill.GeoDMG));
}


function Reset(obj){
    while(obj.lastChild){
	obj.removeChild(obj.lastChild);
    }
}

function test(val){
    if(val === undefined){
	return 0;
    }
    return val;
}

function AddDMGData(type,value){
    switch(type){
    case 'Normal':
    case 'Charged':
    case 'Plunge':
    case 'Skill':
    case 'Burst':
	for(let i=0; i<8; i++){
	    AddDMG[type][Elementlist[i]]+=value;
	}
	break;
    case 'PhysDMG':
    case 'PyroDMG':
    case 'HydroDMG':
    case 'ElectroDMG':
    case 'CryoDMG':
    case 'AnemoDMG':
    case 'GeoDMG':
    case 'DendroDMG':
	for(let i=0; i<5; i++){
	    AddDMG[Attacklist[i]][type]+=value;
	}
	break;
    default:
    }
}

function AddCritRateData(type,value){
    switch(type){
    case 'Normal':
    case 'Charged':
    case 'Plunge':
    case 'Skill':
    case 'Burst':
	for(let i=0; i<8; i++){
	    AddCritRate[type][Elementlist[i]]+=value;
	}
	break;
    case 'PhysDMG':
    case 'PyroDMG':
    case 'HydroDMG':
    case 'ElectroDMG':
    case 'CryoDMG':
    case 'AnemoDMG':
    case 'GeoDMG':
    case 'DendroDMG':
	for(let i=0; i<5; i++){
	    AddCritRate[Attacklist[i]][type]+=value;
	}
	break;
    default:
    }
}


function AddCritDMGData(type,value){
    switch(type){
    case 'Normal':
    case 'Charged':
    case 'Plunge':
    case 'Skill':
    case 'Burst':
	for(let i=0; i<8; i++){
	    AddCritDMG[type][Elementlist[i]]+=value;
	}
	break;
    case 'PhysDMG':
    case 'PyroDMG':
    case 'HydroDMG':
    case 'ElectroDMG':
    case 'CryoDMG':
    case 'AnemoDMG':
    case 'GeoDMG':
    case 'DendroDMG':
	for(let i=0; i<5; i++){
	    AddCritDMG[Attacklist[i]][type]+=value;
	}
	break;
    default:
    }
}

function updateStatus(){
    //HP
    document.getElementById("BaseHPstat").innerText = Character.BaseHP[Character.Level];
    document.getElementById("HPstat").innerText = Character.HP[Character.Level]*100;
    document.getElementById("HPstatWeapon").innerText = Weapon.HP*100;
    document.getElementById("HPstatArtifact").innerText = ((Artifact[0].HP+Artifact[1].HP+Artifact[2].HP)*100).toFixed(1);
    document.getElementById("HPconststatArtifact").innerText = Artifact[3].HPconst;
    //ATK
    document.getElementById("BaseATKstat").innerText = Character.BaseATK[Character.Level];
    document.getElementById("BaseATKstatWeapon").innerText = Weapon.BaseATK;
    document.getElementById("ATKstat").innerText = Character.ATK[Character.Level]*100;
    document.getElementById("ATKstatWeapon").innerText = Weapon.ATK*100;
    document.getElementById("ATKstatArtifact").innerText = ((Artifact[0].ATK+Artifact[1].ATK+Artifact[2].ATK)*100).toFixed(1);
    document.getElementById("ATKconststatArtifact").innerText = Artifact[4].ATKconst;
    document.getElementById("ATKconststatWeapon").innerText = 0;
    //DEF
    document.getElementById("BaseDEFstat").innerText = Character.BaseDEF[Character.Level];
    document.getElementById("DEFstat").innerText = Character.DEF[Character.Level];
    document.getElementById("DEFstatWeapon").innerText = Weapon.DEF;
    document.getElementById("DEFstatArtifact").innerText = ((Artifact[0].DEF+Artifact[1].DEF+Artifact[2].DEF)*100).toFixed(1);

    
    document.getElementById("EMstat").innerText = Character.EM[Character.Level];
    document.getElementById("EMstatWeapon").innerText = Weapon.EM;
    document.getElementById("EMstatArtifact").innerText = Artifact[0].EM+Artifact[1].EM+Artifact[2].EM;

}
