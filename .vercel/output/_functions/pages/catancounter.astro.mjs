import { e as createComponent, f as createAstro, k as renderHead, n as renderComponent, r as renderTemplate } from '../chunks/astro/server_BAyaMtYH.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                        */
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const CatanPlayer = ({
  playerId,
  playerName,
  resources = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
  diceConfig = {},
  onResourceChange,
  onActionClick,
  onDiceConfigChange,
  onPlayerNameChange
}) => {
  const resourceNames = ["brick", "lumber", "ore", "wheat", "wool"];
  const diceNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
  const [activeDiceNumber, setActiveDiceNumber] = useState(2);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [showDetails, setShowDetails] = useState(false);
  const buildingCosts = {
    road: { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 },
    settlement: { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 },
    city: { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 },
    devcard: { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 }
  };
  const [clickTimeouts, setClickTimeouts] = useState({});
  const canAfford = (action) => {
    const cost = buildingCosts[action];
    return Object.entries(cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
  };
  const handleResourceChange = (resource, change) => {
    onResourceChange?.(playerId, resource, change);
  };
  const handleResourceClick = (resource) => {
    const key = resource;
    if (clickTimeouts[key]) {
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      handleResourceChange(resource, -1);
    } else {
      const timeoutId = setTimeout(() => {
        handleResourceChange(resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300);
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };
  const handleConfigClick = (resource) => {
    const key = resource;
    if (clickTimeouts[key]) {
      clearTimeout(clickTimeouts[key]);
      setClickTimeouts((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      handleDiceConfigChange(activeDiceNumber, resource, -1);
    } else {
      const timeoutId = setTimeout(() => {
        handleDiceConfigChange(activeDiceNumber, resource, 1);
        setClickTimeouts((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 300);
      setClickTimeouts((prev) => ({ ...prev, [key]: timeoutId }));
    }
  };
  const handleActionClick = (action) => {
    onActionClick?.(playerId, action);
  };
  const handleDiceConfigChange = (diceNumber, resource, value) => {
    onDiceConfigChange?.(playerId, diceNumber, resource, value);
  };
  const handleNameEdit = () => {
    setTempName(playerName);
    setIsEditingName(true);
  };
  const handleNameSave = () => {
    if (tempName.trim() && tempName !== playerName) {
      onPlayerNameChange?.(playerId, tempName.trim());
    }
    setIsEditingName(false);
  };
  const handleNameCancel = () => {
    setTempName(playerName);
    setIsEditingName(false);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "player", children: [
    /* @__PURE__ */ jsx("div", { className: "player-header", children: isEditingName ? /* @__PURE__ */ jsx("div", { className: "name-edit-container", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: tempName,
        onChange: (e) => setTempName(e.target.value),
        onKeyDown: handleKeyPress,
        onBlur: handleNameSave,
        className: "name-edit-input",
        autoFocus: true,
        maxLength: 20
      }
    ) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h3", { children: playerName }),
      /* @__PURE__ */ jsx("button", { className: "change-player-name-btn", onClick: handleNameEdit, children: "✏" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "player-resources", children: resourceNames.map((resource) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "resource-item",
        onClick: () => handleResourceClick(resource),
        onDoubleClick: () => {
        },
        style: {
          position: "relative",
          display: "inline-block"
        },
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: `/images/${resource}.png`,
              alt: resource,
              style: {
                width: "100%",
                height: "auto",
                display: "block",
                filter: "brightness(0.7)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "resource-count",
              style: {
                position: "absolute",
                bottom: "5px",
                right: "5px",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                padding: "2px 4px",
                borderRadius: "3px",
                fontSize: "2rem",
                fontWeight: "bold"
              },
              children: resources[resource]
            }
          )
        ]
      },
      resource
    )) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "resource-btn",
        onClick: () => setShowDetails(!showDetails),
        children: showDetails ? "Hide Details ▲" : "Show Details ▼"
      }
    ),
    showDetails && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "player-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "action-btn",
            disabled: !canAfford("road"),
            onClick: () => handleActionClick("road"),
            children: "Road"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "action-btn",
            disabled: !canAfford("settlement"),
            onClick: () => handleActionClick("settlement"),
            children: "Settlement"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "action-btn",
            disabled: !canAfford("city"),
            onClick: () => handleActionClick("city"),
            children: "City"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "action-btn",
            disabled: !canAfford("devcard"),
            onClick: () => handleActionClick("devcard"),
            children: "Dev Card"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "dice-config", children: [
        /* @__PURE__ */ jsx("h4", { children: "Dice Configuration" }),
        /* @__PURE__ */ jsx("div", { className: "dice-inputs", children: diceNumbers.map((diceNum) => /* @__PURE__ */ jsx(
          "button",
          {
            className: "dice-label",
            onClick: () => setActiveDiceNumber(diceNum),
            children: diceNum
          },
          diceNum
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "dice-input-group", children: [
          /* @__PURE__ */ jsx("div", { className: "dice-label", children: activeDiceNumber + " :" }),
          resourceNames.map((resource) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "dice-input",
              onClick: () => handleConfigClick(resource),
              onDoubleClick: () => {
              },
              style: {
                backgroundImage: `url(/images/${resource}.png)`,
                backgroundSize: "60px auto",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                userSelect: "none",
                filter: "brightness(0.8)"
              },
              children: /* @__PURE__ */ jsx("span", { style: { color: "white" }, children: diceConfig[activeDiceNumber]?.[resource] ?? 0 })
            },
            `${activeDiceNumber}-${resource}`
          ))
        ] })
      ] })
    ] })
  ] });
};

const PlayersContainer = ({
  players,
  onResourceChange,
  onActionClick,
  onDiceConfigChange,
  onPlayerNameChange
}) => {
  return /* @__PURE__ */ jsx("div", { id: "playerHands", children: players.map((player) => /* @__PURE__ */ jsx(
    CatanPlayer,
    {
      playerId: player.id,
      playerName: player.name,
      resources: player.resources,
      diceConfig: player.diceConfig || {},
      onResourceChange,
      onActionClick,
      onDiceConfigChange,
      onPlayerNameChange
    },
    player.id
  )) });
};

const NumberOfPlayersButton = ({ onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState(4);
  const handleSelectChange = (e) => {
    setSelectedPlayers(parseInt(e.target.value));
  };
  const handleLetsPlay = () => {
    window.dispatchEvent(new CustomEvent("updatePlayers", { detail: selectedPlayers }));
    setIsModalOpen(false);
    onChange(selectedPlayers);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsModalOpen(true),
        style: {
          background: "#464647",
          color: "white",
          border: "2px solid steelblue",
          borderRadius: "15px",
          padding: "10px",
          fontSize: "0.8rem",
          cursor: "pointer",
          transition: "0.2s"
        },
        onMouseOver: (e) => e.currentTarget.style.background = "steelblue",
        onMouseOut: (e) => e.currentTarget.style.background = "#464647",
        children: "number of players"
      }
    ),
    isModalOpen && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1e3
        },
        onClick: () => setIsModalOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              background: "#464647",
              color: "white",
              padding: "20px",
              borderRadius: "20px",
              textAlign: "center",
              minWidth: "300px"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx("h2", { children: "Select Number of Players" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedPlayers,
                  onChange: handleSelectChange,
                  style: {
                    background: "#464648",
                    color: "white",
                    border: "2px solid steelblue",
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "1.2rem",
                    marginBottom: "20px",
                    width: "100%"
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 2, children: "2" }),
                    /* @__PURE__ */ jsx("option", { value: 3, children: "3" }),
                    /* @__PURE__ */ jsx("option", { value: 4, children: "4" }),
                    /* @__PURE__ */ jsx("option", { value: 5, children: "5" }),
                    /* @__PURE__ */ jsx("option", { value: 6, children: "6" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleLetsPlay,
                  style: {
                    background: "steelblue",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    transition: "0.2s"
                  },
                  onMouseOver: (e) => e.currentTarget.style.background = "#005a87",
                  onMouseOut: (e) => e.currentTarget.style.background = "steelblue",
                  children: "Let's Play!"
                }
              )
            ]
          }
        )
      }
    )
  ] });
};

const setBlankPlayer = (i) => {
  return {
    id: i + 1,
    name: `Player ${i + 1}`,
    resources: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
    diceConfig: {
      2: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      3: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      4: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      5: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      6: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      8: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      9: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      10: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      11: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 },
      12: { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 }
    }
  };
};
const CatanGame = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);
  const [players, setPlayers] = useState(
    () => Array.from({ length: numberOfPlayers }, (_, i) => setBlankPlayer(i))
  );
  const handleDiceRoll = (roll) => {
    const updatedPlayers = players.map((player) => {
      const newResources = { ...player.resources };
      const diceResources = player.diceConfig[roll];
      if (diceResources) {
        for (const resource in diceResources) {
          const key = resource;
          newResources[key] += diceResources[key];
        }
      }
      return { ...player, resources: newResources };
    });
    setPlayers(updatedPlayers);
  };
  const handleNumberOfPlayersChange = (newCount) => {
    setNumberOfPlayers(newCount);
    setPlayers((prevPlayers) => {
      const updated = [...prevPlayers];
      if (newCount > prevPlayers.length) {
        for (let i = prevPlayers.length; i < newCount; i++) {
          updated.push(setBlankPlayer(i));
        }
      } else {
        updated.splice(newCount);
      }
      return updated;
    });
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Catan Card Counter" }),
      /* @__PURE__ */ jsx(NumberOfPlayersButton, { onChange: handleNumberOfPlayersChange })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "diceDiv", children: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map((num) => /* @__PURE__ */ jsx(
      "button",
      {
        className: "dice",
        id: `dice${num}`,
        onClick: () => handleDiceRoll(num),
        children: num
      },
      num
    )) }),
    /* @__PURE__ */ jsx("div", { className: "main-catan-center", children: /* @__PURE__ */ jsx(
      PlayersContainer,
      {
        players,
        onResourceChange: (playerId, resource, change) => {
          setPlayers((prev) => prev.map(
            (p) => p.id === playerId ? { ...p, resources: { ...p.resources, [resource]: p.resources[resource] + change > 0 ? p.resources[resource] + change : 0 } } : p
          ));
        },
        onActionClick: (playerId, action) => {
          let cost = { brick: 0, lumber: 0, ore: 0, wheat: 0, wool: 0 };
          if (action === "road") cost = { brick: 1, lumber: 1, ore: 0, wheat: 0, wool: 0 };
          else if (action === "settlement") cost = { brick: 1, lumber: 1, ore: 0, wheat: 1, wool: 1 };
          else if (action === "city") cost = { brick: 0, lumber: 0, ore: 3, wheat: 2, wool: 0 };
          else if (action === "devcard") cost = { brick: 0, lumber: 0, ore: 1, wheat: 1, wool: 1 };
          setPlayers((prev) => prev.map(
            (p) => p.id === playerId ? {
              ...p,
              resources: {
                ...p.resources,
                ...Object.fromEntries(
                  Object.entries(cost).map(([res, amt]) => [res, p.resources[res] - amt])
                )
              }
            } : p
          ));
          console.log(`Player ${playerId} built a ${action}`);
        },
        onDiceConfigChange: (playerId, diceNumber, resource, value) => {
          setPlayers((prev) => prev.map(
            (p) => p.id === playerId ? {
              ...p,
              diceConfig: {
                ...p.diceConfig,
                [diceNumber]: {
                  ...p.diceConfig?.[diceNumber],
                  [resource]: p.diceConfig?.[diceNumber][resource] + value < 0 ? 0 : p.diceConfig?.[diceNumber][resource] + value
                }
              }
            } : p
          ));
        },
        onPlayerNameChange: (playerId, newName) => {
          setPlayers((prev) => prev.map(
            (p) => p.id === playerId ? { ...p, name: newName } : p
          ));
        }
      }
    ) })
  ] });
};

function attribution({ description, href, creditText }) {
  return /* @__PURE__ */ jsxs("div", { className: "attribution-container", children: [
    /* @__PURE__ */ jsx("div", { className: "attribution-description", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "attribution-credit", children: [
      "Credit: ",
      creditText
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "attribution-links", children: [
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Ruffles Kerman.  |",
      /* @__PURE__ */ jsx("a", { href: "/no", children: "Don't click" }),
      "  |",
      /* @__PURE__ */ jsx("a", { href: "/no1", children: "Don't click this either" })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Catancounter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Catancounter;
  return renderTemplate`<html lang="en"> <head><!-- Required meta tags --><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>Catan Card Counter</title>${renderHead()}</head> <body> ${renderComponent($$result, "CatanGame", CatanGame, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/rutle/source/repos/ruffleskerman.com/src/components/catan/CatanGame", "client:component-export": "default" })} ${renderComponent($$result, "Attribution", attribution, { "description": "This site help you keep track of cards in the game Settlers of Catan. It is useful for strategic robber placement, playing the monopoly dev card, and dynamic planning against opponents.", "href": "/catancounter", "creditText": "Originally made in Python by Rutledge Dixon. Converted to html and js by Owen Dixon. Converted to Astro using react by Rutledge Dixon." })} </body></html>`;
}, "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/catancounter.astro", void 0);

const $$file = "C:/Users/rutle/source/repos/ruffleskerman.com/src/pages/catancounter.astro";
const $$url = "/catancounter";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catancounter,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
